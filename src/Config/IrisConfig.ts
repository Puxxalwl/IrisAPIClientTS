import path from "path";
import fs from "fs";

export interface IrisAPIConfig {
    IrisUrl: string;
    botId: string;
    IrisToken: string;
}

export class IrisConfig {
    IrisApi: IrisAPIConfig;

    private constructor(config: IrisAPIConfig) {
        this.IrisApi = {
            IrisUrl: config.IrisUrl ?? "https://iris-tg.ru/api",
            botId: config.botId,
            IrisToken: config.IrisToken
        };
    }

    static LoadFrom(configPath: string = "IrisSettings.json", env: boolean = false): IrisConfig {
        let IrisApi: IrisAPIConfig;

        if (env) {
            IrisApi = {
                IrisUrl: process.env.IRIS_URL ?? "https://iris-tg.ru/api",
                botId: process.env.IRIS_BOT_ID ?? "",
                IrisToken: process.env.IRIS_TOKEN ?? ""
            };
            if (!IrisApi.botId || !IrisApi.IrisToken) {
                throw new Error("В .env отсутствуют параметры IRIS_BOT_ID и IRIS_TOKEN");
            }
        } else {
            const fullPath = path.resolve(process.cwd(), configPath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`Отсутствует конфиг ${configPath}`);
            }

            const raw = fs.readFileSync(fullPath, "utf-8");
            const parse = JSON.parse(raw);

            if (!parse.IrisApi) {
                throw new Error(`В конфиге ${configPath} отсутствует IrisApi`);
            }

            IrisApi = {
                IrisUrl: parse.IrisApi.IrisUrl ?? "https://iris-tg.ru/api",
                botId: parse.IrisApi.botId,
                IrisToken: parse.IrisApi.IrisToken
            };

            if (!IrisApi.botId || !IrisApi.IrisToken) {
                throw new Error(`В конфиге ${configPath} отсутствуют параметры botId и IrisToken`);
            }
        }

        return new IrisConfig(IrisApi);
    }
}