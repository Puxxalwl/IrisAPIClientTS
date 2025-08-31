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

    static LoadFrom(env: boolean = false, configPath?:string, setProxyStatus?:boolean): IrisConfig|void {
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
                console.log("В .env отсутствуют параметры IRIS_BOT_ID и IRIS_TOKEN");
                return
            }
            if (proxyStatus && !proxyUrl) {
                console.log("Нужно указать proxyUrl чтобы его использовать")
                return
            }
        } else {
            configPath = configPath ?? "IrisSettings.json"
            const fullPath = path.resolve(process.cwd(), configPath);
            if (!fs.existsSync(fullPath)) {
                console.log(`Отсутствует конфиг ${configPath}`);
                return
            }

            const raw = fs.readFileSync(fullPath, "utf-8");
            const parse = JSON.parse(raw);

            IrisUrl = parse.IrisUrl ?? "https://iris-tg.ru/api";
            botId = parse.botId;
            IrisToken = parse.IrisToken;
            proxyStatus = parse.proxyStatus;
            proxyUrl = parse.proxyUrl ??undefined
            
            if (!botId || !IrisToken) {
                console.log(`В конфиге ${configPath} отсутствуют параметры botId и IrisToken`);
                return;
            }
            if (proxyStatus && !proxyUrl) {
                console.log(`Нужно указать в конфиге ${configPath} proxyUrl чтобы его использовать`)
                return
            }
        }

        return new IrisConfig({IrisUrl, IrisToken, botId, proxyStatus, proxyUrl});
    }
}