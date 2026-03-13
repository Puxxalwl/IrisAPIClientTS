import { AxiosInstance, AxiosRequestConfig } from "axios";
import { IrisLogger } from "../extensions/logger";

export interface IrisAPIConfig {
    /** API base URL, default: https://iris-tg.ru/api */
    baseUrl?: string;
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
    /** Настройки встроенного логирования */
    logging?: IrisAPILoggingConfig;

    /** 
    * Свой axios инстанс.
    * Если передан, остальные настройки (timeout, headers, proxy и т.д) игнорируются 
    */
    instance?: AxiosInstance;
}

export interface IrisAPILoggingConfig {
    /** Кастомный логгер (по умолчанию используется noopLogger) */
    logger?: IrisLogger;
    /** Логировать исходящие запросы */
    requests?: boolean;
    /** Логировать успешные ответы */
    responses?: boolean;
    /** Логировать retry-попытки */
    retries?: boolean;
}

export interface IrisAPIBot {
    /** ID бота */
    botId: number;
    /** Токен бота для доступа к API */
    token: string;
}

export interface IrisAPIProxy {
    /** Включить прокси */
    enabled: boolean;
    /** Протокол, default: "http" */
    protocol?: "http" | "https";
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