import winston from "winston";
import { ILoggerService } from "./iLoggerService";

export class LoggerService implements ILoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console()
            ]
        });
    }

    public logInformation(message: string): void {
        this.logger.info(message);
    }

    public logError(message: string, err?: Error): void {
        this.logger.error(`${message}${err ? " " + err.stack : ""}`);
    }

    public logWarn(message: string): void {
        this.logger.warn(message);
    }
}