import { IrisConfig } from "../Config/IrisConfig";
import { ApiConstants } from "../Consts/ApiConsts";
import { HttpClientExtensions } from "../Extensions/HttpClientExtensions";
import { Balance, HistoryIris, Result, ResultGive, UpdateIris } from "../Models/Types";


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
    private readonly irisUrl: string;
    private readonly _httpClient:HttpClientExtensions

    constructor(Options:InitClientOptions) {
        this.config = Options.config;
        this.irisUrl = `${this.config.IrisUrl}/v2.0/${this.config.botId}:${this.config.IrisToken}`;
        this._httpClient = new HttpClientExtensions(
            this.config.proxyStatus,
            this.config.proxyStatus ? this.config.proxyUrl : undefined
        );
    }

    static create(Options?:CreateOptions): IrisApiClient {
        const config = IrisConfig.LoadFrom(Options?.env, Options?.configPath, Options?.proxyStatus)!;
        return new IrisApiClient({ config });
    }
    
    async getBalance(): Promise<Balance> {
        const url = `${this.irisUrl}${ApiConstants.Balance}`;
        return await this._httpClient.getWithRetry<Balance>(url, "Ошибка получения баланса");
    }

    async giveSweets(userId: number, sweets: number, Options?:giveSweetsOptions): Promise<ResultGive> {
        const url = `${this.irisUrl}${ApiConstants.GiveSweets}`;
        const params = {
            sweets,
            user_id: userId,
            comment:Options?.comment ?? "",
            without_donate_score: Options?.withoutDonateScore ?? true
        };

        return await this._httpClient.getWithRetry<ResultGive>(url, "Ошибка перевода ирисок",params);
    }

    async openBag(status: boolean): Promise<Result> {
        const url = `${this.irisUrl}${status ? ApiConstants.Open : ApiConstants.Close}`;
        return await this._httpClient.getWithRetry<Result>(url, "Ошибка открытия/закрытия мешка");
    }

    async allowAll(status: boolean): Promise<Result> {
        const url = `${this.irisUrl}${status ? ApiConstants.AllAllow : ApiConstants.AllDeny}`;
        return await this._httpClient.getWithRetry<Result>(url, "Ошибка при изменении статуса переводов для всех");
    }

    async allowUser(status: boolean, userId: number): Promise<Result> {
        const url = `${this.irisUrl}${status ? ApiConstants.AllowUser : ApiConstants.DenyUser}`;
        const params = { user_id: userId };
        return await this._httpClient.getWithRetry<Result>(url, "Ошибка при изменении статуса переводов для пользователя (userId: ${userId})",params);
    }

    async getSweetsHistory(offset:number = 0):Promise<HistoryIris[]> {
        const url = `${this.irisUrl}/${ApiConstants.SweetsHistory}`
        const params = {offset:offset};
        return await this._httpClient.getWithRetry<HistoryIris[]>(url,"Ошибка получения истории ирисок",params);
    }

    async getGoldHistory(offset:number = 0):Promise<HistoryIris[]> {
        const url = `${this.irisUrl}/${ApiConstants.SweetsHistory}`
        const params = {offset:offset};
        return await this._httpClient.getWithRetry<HistoryIris[]>(url,"Ошибка получения истории ирис-голд",params);
    }

    async getUpdates():Promise<UpdateIris> {
        const url = `${this.irisUrl}/${ApiConstants.getUpdates}`
        return await this._httpClient.getWithRetry<UpdateIris>(url, 'Ошибка получения логов');
    }
}
