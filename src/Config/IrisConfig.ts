import path from "path";
import fs from "fs";

export interface IrisAPIConfig {
    IrisUrl: string;
    botId: string;
    IrisToken: string;
    proxyStatus?:boolean
    proxyUrl?: string;

}

export class IrisConfig {
    public readonly IrisUrl: string;
    public readonly botId: string;
    public readonly IrisToken: string;
    public readonly proxyStatus?:boolean
    public readonly proxyUrl?: string;

    private constructor(config: IrisAPIConfig) {
        this.IrisUrl = config.IrisUrl ?? "https://iris-tg.ru/api";
        this.botId = config.botId;
        this.IrisToken= config.IrisToken;
        this.proxyStatus = config.proxyStatus;
        this.proxyUrl = config.proxyUrl;
    }

    static LoadFrom(env: boolean = false, configPath?:string, setProxyStatus?:boolean): IrisConfig {
        let IrisUrl:string;
        let botId:string;
        let IrisToken:string;
        let proxyStatus:boolean|undefined
        let proxyUrl:string|undefined


        if (env) {
            IrisUrl = process.env.IRIS_URL ?? "https://iris-tg.ru/api"
            botId = process.env.IRIS_BOT_ID ?? ""
            IrisToken= process.env.IRIS_TOKEN ?? ""
            proxyStatus = setProxyStatus
            proxyUrl = process.env.PROXY_URL ?? undefined

            if (!botId || !IrisToken) {
                throw new Error("В .env отсутствуют параметры IRIS_BOT_ID и IRIS_TOKEN");
            }
            if (proxyStatus && !proxyUrl) {
                throw new Error("Нужно указать proxyUrl чтобы его использовать")
            }
        } else {
            configPath = configPath ?? "IrisSettings.json"
            const fullPath = path.resolve(process.cwd(), configPath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Отсутствует конфиг ${configPath}`);
            }

            const raw = fs.readFileSync(fullPath, "utf-8");
            const parse = JSON.parse(raw);

            if (!parse.IrisApi) {
                throw new Error(`В конфиге ${configPath} отсутствует IrisApi`);
            }

            
            IrisUrl = parse.IrisUrl ?? "https://iris-tg.ru/api";
            botId = parse.botId;
            IrisToken = parse.IrisToken;
            proxyStatus = parse.proxyStatus;
            proxyUrl = parse.IrisApi.proxyUrl ??undefined
            
            if (!botId || !IrisToken) {
                throw new Error(`В конфиге ${configPath} отсутствуют параметры botId и IrisToken`);
            }
            if (proxyStatus && !proxyUrl) {
                throw new Error(`Нужно указать в конфиге ${configPath} proxyUrl чтобы его использовать`)
            }
        }

        return new IrisConfig({IrisUrl, IrisToken, botId, proxyStatus, proxyUrl});
    }
}