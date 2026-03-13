import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "./types/apiError";
import { Balance } from "./types/balance";
import { IrisAPIConfig } from "./types/configs";
import { Result } from "./types/result";
import { CurrencyType } from "./types/enums/currencyType";
import { TradeAction } from "./types/enums/tradeAction";
import { UserInfoType } from "./types/enums/userInfoType";
import {
    CurrencyTransaction,
    GiveOptions,
    NftHistoryItem,
    NftInfo,
    NftListItem,
    TgStarsPrice,
    TradeCancelResult,
    TradeDeal,
    TradeExecutionResult,
    TradeOrderbook,
    UpdateEvent,
    UserInfoResultMap
} from "./types/transactions";
import { apiPath, givePathByCurrency, historyPathByCurrency } from "./types/constants/apiPath";
import { IrisLogger, noopLogger } from "./extensions/logger";


/**
 * Iris API клиент (v0.5): обертка над HTTP-запросами с retry и типизацией.
 */
export class IrisApiClient {
    private readonly config: Required<Pick<IrisAPIConfig, "version" | "timeout">> & IrisAPIConfig;
    private readonly http: AxiosInstance;
    private readonly baseUrl: string;
    private readonly logger: IrisLogger;

    constructor(config: IrisAPIConfig) {
        this.config = {
            ...config,
            version: config.version ?? 0.5,
            timeout: config.timeout ?? 10_000
        };

        this.http = config.instance ?? this.createHttpClient();
        this.baseUrl = this.config.baseUrl ?? process.env.IRIS_URL ?? "https://iris-tg.ru/api";
        this.logger = this.config.logging?.logger ?? noopLogger;
    }

    /** Получить баланс мешка бота. */
    public async getBalance(): Promise<Balance> {
        const result = await this.request<Balance>(apiPath.Balance);
        return result.result;
    }

    /**
     * Универсальная передача валюты пользователю.
     * Для Sweets/Gold дополнительно поддерживаются опции донат-очков.
     */
    public async give(currency: CurrencyType, userId: number, amount: number, options: GiveOptions = {}): Promise<number> {
        const path = givePathByCurrency[currency];
        const payload: Record<string, unknown> = {
            user_id: userId,
            amount
        };

        if (options.comment) {
            payload.comment = options.comment;
        }

        if (currency === CurrencyType.Sweets || currency === CurrencyType.Gold) {
            if (typeof options.withoutDonateScore === "boolean") {
                payload.without_donate_score = options.withoutDonateScore;
            }
            if (typeof options.donateScore === "number") {
                payload.donate_score = options.donateScore;
            }
        }

        const result = await this.request<number>(path, payload);
        return result.result;
    }

    /** Универсально получить историю операций по выбранной валюте. */
    public async getTransactions(currency: CurrencyType, offset = 0, limit = 200): Promise<CurrencyTransaction[]> {
        const path = historyPathByCurrency[currency];
        const result = await this.request<CurrencyTransaction[]>(path, { offset, limit });
        return result.result;
    }

    /** Купить tgstars за ириски. */
    public async buyTgStars(amount: number): Promise<number> {
        const result = await this.request<number>(apiPath.TgStarsBuy, { amount });
        return result.result;
    }

    /** Оценить стоимость tgstars в ирисках. */
    public async getTgStarsPrice(amount: number): Promise<TgStarsPrice> {
        const result = await this.request<TgStarsPrice>(apiPath.TgStarsPrice, { amount });
        return result.result;
    }

    /** Открыть или закрыть мешок бота. */
    public async setPocketEnabled(enabled: boolean): Promise<boolean> {
        const path = enabled ? apiPath.PocketEnable : apiPath.PocketDisable;
        const result = await this.request<boolean>(path);
        return result.result;
    }

    /** Разрешить или запретить переводы всем пользователям. */
    public async setPocketAccessForAll(allowAll: boolean): Promise<boolean> {
        const path = allowAll ? apiPath.PocketAllowAll : apiPath.PocketDenyAll;
        const result = await this.request<boolean>(path);
        return result.result;
    }

    /** Разрешить или запретить переводы конкретному пользователю. */
    public async setPocketAccessForUser(userId: number, allow: boolean): Promise<boolean | number> {
        const path = allow ? apiPath.PocketAllowUser : apiPath.PocketDenyUser;
        const result = await this.request<boolean | number>(path, { user_id: userId });
        return result.result;
    }

    /** Универсально получить информацию о пользователе по типу запроса. */
    public async getUserInfo<T extends UserInfoType>(type: T, userId: number): Promise<UserInfoResultMap[T]> {
        const pathMap: Record<UserInfoType, string> = {
            [UserInfoType.Reg]: apiPath.UserInfoReg,
            [UserInfoType.Activity]: apiPath.UserInfoActivity,
            [UserInfoType.Spam]: apiPath.UserInfoSpam,
            [UserInfoType.Stars]: apiPath.UserInfoStars,
            [UserInfoType.Pocket]: apiPath.UserInfoPocket
        };

        const result = await this.request<UserInfoResultMap[T]>(pathMap[type], { user_id: userId });
        return result.result;
    }

    /** Получить список событий из updates/getUpdates. */
    public async getUpdates(offset = 0, limit = 200): Promise<UpdateEvent[]> {
        const result = await this.request<UpdateEvent[]>(apiPath.UpdatesGet, { offset, limit });
        return result.result;
    }

    /** Универсальный метод торговли: покупка или продажа голды. */
    public async trade(action: TradeAction, price: number, volume: number): Promise<TradeExecutionResult> {
        const path = action === TradeAction.Buy ? apiPath.TradeBuy : apiPath.TradeSell;
        const result = await this.request<TradeExecutionResult>(path, { price, volume });
        return result.result;
    }

    /** Отменить заявки по указанной цене. */
    public async cancelTradeByPrice(price: number): Promise<TradeCancelResult> {
        const result = await this.request<TradeCancelResult>(apiPath.TradeCancelPrice, { price });
        return result.result;
    }

    /** Отменить все открытые заявки. */
    public async cancelAllTrades(): Promise<TradeCancelResult> {
        const result = await this.request<TradeCancelResult>(apiPath.TradeCancelAll);
        return result.result;
    }

    /** Частично отменить заявку по ID и объему. */
    public async cancelTradePart(id: number, volume: number): Promise<TradeCancelResult> {
        const result = await this.request<TradeCancelResult>(apiPath.TradeCancelPart, { id, volume });
        return result.result;
    }

    /** Получить текущий стакан заявок. */
    public async getOrderbook(): Promise<TradeOrderbook> {
        const result = await this.request<TradeOrderbook>(apiPath.TradeOrderbook);
        return result.result;
    }

    /** Получить ленту сделок биржи. */
    public async getDeals(id = 0, limit = 200): Promise<TradeDeal[]> {
        const result = await this.request<TradeDeal[]>(apiPath.TradeDeals, { id, limit });
        return result.result;
    }

    /** Передать NFT пользователю по id/name. */
    public async giveNft(userId: number, params: { id?: number; name?: string; comment?: string }): Promise<number> {
        const payload: Record<string, unknown> = { user_id: userId };

        if (typeof params.id === "number") {
            payload.id = params.id;
        }
        if (params.name) {
            payload.name = params.name;
        }
        if (params.comment) {
            payload.comment = params.comment;
        }

        const result = await this.request<number>(apiPath.NftGive, payload);
        return result.result;
    }

    /** Получить информацию о NFT по id или name. */
    public async getNftInfo(params: { id?: number; name?: string }): Promise<NftInfo> {
        const result = await this.request<NftInfo>(apiPath.NftInfo, params);
        return result.result;
    }

    /** Получить список NFT в мешке бота. */
    public async getNftList(offset = 0, limit = 200): Promise<NftListItem[]> {
        const result = await this.request<NftListItem[]>(apiPath.NftList, { offset, limit });
        return result.result;
    }

    /** Получить историю операций с NFT. */
    public async getNftHistory(offset = 0, limit = 200): Promise<NftHistoryItem[]> {
        const result = await this.request<NftHistoryItem[]>(apiPath.NftHistory, { offset, limit });
        return result.result;
    }

    /** Получить актуальную версию Iris API. */
    public async getLastVersion(): Promise<string> {
        const result = await this.request<string>(apiPath.LastVersion, undefined);
        return result.result;
    }

    /** Получить список Telegram ID аккаунтов агентов Iris. */
    public async getIrisAgents(): Promise<number[]> {
        const result = await this.request<number[]>(apiPath.IrisAgents);
        return result.result;
    }

    /** Создать axios-инстанс с таймаутом/заголовками/прокси. */
    private createHttpClient(): AxiosInstance {
        const axiosConfig: AxiosRequestConfig = {
            timeout: this.config.timeout,
            headers: this.config.headers
        };

        if (this.config.proxy?.enabled) {
            if (this.config.proxy.host && this.config.proxy.port) {
                axiosConfig.proxy = {
                    protocol: this.config.proxy.protocol ?? "http",
                    host: this.config.proxy.host,
                    port: this.config.proxy.port,
                    auth: this.config.proxy.auth
                };
            }
        }

        return axios.create(axiosConfig);
    }

    /** Создание URL */
    private buildUrl(methodPath: string): string {
        const token = `${this.config.bot.botId}_${this.config.bot.token}`;
        return `${this.baseUrl}/v${this.config.version}/${token}/${methodPath}`;
    }


    /**
     * Выполнить GET-запрос к Iris API.
     * Повторы выполняются для сетевых ошибок и не исключенных статусов.
     */
    public async request<T>(methodPath: string, params?: Record<string, unknown>): Promise<Result<T>> {
        const retries = this.config.retry?.retries ?? 3;
        const delay = this.config.retry?.delay ?? 500;
        const excludeStatuses = this.config.retry?.excludeStatuses ?? [401, 403];
        const exponential = this.config.retry?.exponential ?? false;
        const requestUrl = this.buildUrl(methodPath);

        let attempt = 0;

        while (true) {
            try {
                if (this.config.logging?.requests) {
                    this.logger.debug("Iris request", {
                        method: "GET",
                        url: requestUrl,
                        params,
                        attempt: attempt + 1
                    });
                }

                const response = await this.http.get<Result<T>>(requestUrl, {
                    params
                });

                if (this.config.logging?.responses) {
                    this.logger.debug("Iris response", {
                        method: "GET",
                        url: requestUrl,
                        status: response.status,
                        attempt: attempt + 1
                    });
                }

                return response.data;
            } catch (error) {
                const typed = error as AxiosError<ApiErrorResponse>;
                const status = typed.response?.status;
                const shouldRetry = attempt < retries && (!status || !excludeStatuses.includes(status));

                if (!shouldRetry) {
                    const apiError = typed.response?.data?.error;
                    this.logger.error("Iris request failed", {
                        method: "GET",
                        url: requestUrl,
                        status,
                        attempt: attempt + 1,
                        apiError,
                        message: typed.message
                    });

                    if (apiError) {
                        throw new Error(`Iris API Error ${apiError.code}: ${apiError.description}`);
                    }
                    throw error;
                }

                const currentDelay = exponential ? delay * Math.pow(2, attempt) : delay;

                if (this.config.logging?.retries) {
                    this.logger.warn("Iris request retry", {
                        method: "GET",
                        url: requestUrl,
                        status,
                        attempt: attempt + 1,
                        nextDelayMs: currentDelay,
                        message: typed.message
                    });
                }

                await new Promise((resolve) => setTimeout(resolve, currentDelay));
                attempt += 1;
            }
        }
    }
}
