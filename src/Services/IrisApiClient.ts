import { IrisConfig } from "../Config/IrisConfig";
import { ApiConstants } from "../Consts/ApiConsts";
import { HttpClientExtensions } from "../Extensions/HttpClientExtensions";
import { Balance, Result, SweetsFull } from "../Models/Types";
import { ILoggerService } from "./iLoggerService";
import { LoggerService } from "./LoggerService";

interface InitClientOptions{
    config:IrisConfig,
    proxyStatus?:boolean
}

interface CreateOptions {
    env?:boolean,
    configPath?:string,
    proxyStatus?:boolean
}

interface giveSweetsOptions {
    comment?:string, 
    withoutDonateScore?:boolean
}

export class IrisApiClient {
    private readonly config: IrisConfig;
    private readonly logger: ILoggerService;
    private readonly irisUrl: string;
    private readonly _httpClient:HttpClientExtensions

    constructor(Options:InitClientOptions) {
        this.config = Options.config;
        this.logger = new LoggerService();
        this.irisUrl = `${this.config.IrisUrl}/${this.config.botId}_${this.config.IrisToken}`;
        this._httpClient = new HttpClientExtensions(
            this.config.proxyStatus,
            this.config.proxyStatus ? this.config.proxyUrl : undefined
        );
    }

    static create(Options:CreateOptions): IrisApiClient {
        const config = IrisConfig.LoadFrom(Options.env, Options.configPath, Options.proxyStatus);
        return new IrisApiClient({ config });
    }

    async getBalance(): Promise<Balance> {
        try {
            const url = `${this.irisUrl}${ApiConstants.Balance}`;
            return await this._httpClient.getWithRetry<Balance>(url);
        } catch (err: any) {
            this.logger.logError(`Ошибка получения баланса: ${err.message}`, err);
            throw err;
        }
    }

    async giveSweets(userId: number, sweets: number, Options?:giveSweetsOptions): Promise<SweetsFull | null> {
        try {
            const url = `${this.irisUrl}${ApiConstants.GiveSweets}`;
            const params = {
                sweets,
                user_id: userId,
                comment:Options?.comment ?? "",
                without_donate_score: Options?.withoutDonateScore ?? true
            };

            const result = await this._httpClient.getWithRetry<SweetsFull>(url, params);
            if (!result.result) return null;
            return result;
        } catch (err: any) {
            this.logger.logError(`Ошибка перевода ирисок: ${err.message}`, err);
            throw err;
        }
    }

    async openBag(status: boolean): Promise<Result> {
        try {
            const url = `${this.irisUrl}${status ? ApiConstants.Open : ApiConstants.Close}`;
            return await this._httpClient.getWithRetry<Result>(url);
        } catch (err: any) {
            this.logger.logError(`Ошибка открытия/закрытия мешка: ${err.message}`, err);
            throw err;
        }
    }

    async allowAll(status: boolean): Promise<Result> {
        try {
            const url = `${this.irisUrl}${status ? ApiConstants.AllAllow : ApiConstants.AllDeny}`;
            return await this._httpClient.getWithRetry<Result>(url);
        } catch (err: any) {
            this.logger.logError(`Ошибка при изменении статуса переводов для всех: ${err.message}`, err);
            throw err;
        }
    }

    async allowUser(status: boolean, userId: number): Promise<Result> {
        try {
            const url = `${this.irisUrl}${status ? ApiConstants.AllowUser : ApiConstants.DenyUser}`;
            const params = { user_id: userId };
            return await this._httpClient.getWithRetry<Result>(url, params);
        } catch (err: any) {
            this.logger.logError(`Ошибка при изменении статуса переводов для пользователя (userId: ${userId}): ${err.message}`, err);
            throw err;
        }
    }
}