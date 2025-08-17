export interface ILoggerService {
    logInformation(message: string): void;
    logError(message: string, err?: Error): void;
    logWarn(message: string): void;
}