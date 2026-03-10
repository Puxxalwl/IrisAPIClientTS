import { AxiosInstance, AxiosRequestConfig } from "axios";

export interface IrisAPIConfig {
    /** Данные бота */
    bot: IrisAPIBot;
    /** Версия апи, default: 0.5 (Крайне не рекомендуется изменять)*/
    version?: number;
    /** Таймаут запросов в мс, default: 10_000 */
    timeout?: number;
    /** Дефолтные заголовки для всех запросов */
    headers?: Record<string, string>;
    /** Настройки прокси */
    proxy?: IrisAPIProxy;
    /** Конфиг retry при ошибках */
    retry?: RetryConfig;

    /** 
    * Свой axios инстанс.
    * Если передан, остальные настройки (timeout, headers, proxy и т.д) игнорируются 
    */
    instance?: AxiosInstance;
}

export interface IrisAPIBot {
    botId: number;
    token: string;
}

export interface IrisAPIProxy {
    /** Включить прокси */
    enabled: boolean;
    /** Протокол, default: "http" */
    protocol?: "http" | "https" | "socks4" | "socks5";
    /** Хост прокси */
    host?: string;
    /** Порт прокси */
    port?: number;
    /** Авторизация, если прокси требует */
    auth?: {
        username: string;
        password: string;
    };
}

export interface RetryConfig {
    /** Кол-во повторных попыток, default: 3 */
    retries?: number;
    /** Задержка между попытками в мс, default: 500 */
    delay?: number;
    /** 
    * Экспоненциальный рост задержки (delay *2^at).
    * Например при delay: 500 -> 500,1000,2000 и т.д
    * default: false
    */
    exponential?: boolean;
    
    /**
    * HTTP статусы на которых НЕ делать retry.
    * default: [401, 403]
    */
    excludeStatuses?: number[];
}