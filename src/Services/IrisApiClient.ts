import { IrisConfig } from "../Config/IrisConfig";
import { ApiConstants } from "../Consts/ApiConsts";
import { HttpClientExtensions } from "../Extensions/HttpClientExtensions";
import { Balance, Result, SweetsFull } from "../Models/Types";
import { ILoggerService } from "./iLoggerService";
import { LoggerService } from "./LoggerService";

export class IrisApiClient {
    private readonly config: IrisConfig;
    private readonly logger: ILoggerService;
    private readonly irisUrl: string;
    private readonly _httpClient:HttpClientExtensions

    constructor(config: IrisConfig, logger: ILoggerService) {
        this.config = config;
        this.logger = logger;
        this.irisUrl = `${this.config.IrisApi.IrisUrl}/${this.config.IrisApi.botId}_${this.config.IrisApi.IrisToken}`;
        this._httpClient = new HttpClientExtensions()
    }

    static create(configPath = "IrisSettings.json", env:boolean = false): IrisApiClient {
        const config = IrisConfig.LoadFrom(configPath, env);
        const logger = new LoggerService();
        return new IrisApiClient(config, logger);
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

    async giveSweets(userId: number, sweets: number, withoutDonateScore: boolean, comment = ""): Promise<SweetsFull | null> {
        try {
            const url = `${this.irisUrl}${ApiConstants.GiveSweets}`;
            const params = {
                sweets,
                user_id: userId,
                comment,
                without_donate_score: withoutDonateScore
            };

            const result = await this._httpClient.getWithRetry<SweetsFull>(url, params);
            if (result.result !== "ok") return null;
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