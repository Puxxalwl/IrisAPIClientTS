import { IrisApiClient } from "../../src/IrisApiClient"; 
import { IrisAPIConfig } from "../../src/types/configs";
import { CurrencyType } from "../../src/types/enums/currencyType";

const config: IrisAPIConfig = {
    // [ОБЯЗАТЕЛЬНО] Данные вашего бота
    bot: { 
        botId: 12345, 
        token: "YOUR_TOKEN" 
    },

    // [ОПЦИОНАЛЬНО] Базовый URL API. По умолчанию: https://iris-tg.ru/api
    // baseUrl: "https://iris-tg.ru/api",

    // [ОПЦИОНАЛЬНО] Версия API. По умолчанию: 0.5
    // Не меняйте, если не уверены в совместимости.
    version: 0.5,

    // [ОПЦИОНАЛЬНО] Таймаут запроса в миллисекундах. По умолчанию: 10_000 (10 сек)
    timeout: 10_000,

    // [ОПЦИОНАЛЬНО] Настройки повторных попыток при ошибках сети (5xx)
    retry: {
        retries: 3, // Количество попыток
        delay: 1000, // Базовая задержка (мс)
        exponential: true, // Увеличивать задержку в 2 раза с каждой попыткой
        excludeStatuses: [401, 403, 404] // Статусы, при которых НЕ нужно повторять запрос
    },

    // [ОПЦИОНАЛЬНО] Настройки логирования
    logging: {
        requests: true, // Логировать каждый исходящий запрос
        responses: false, // Логировать успешные ответы (может засорять консоль)
        retries: true, // Уведомлять о повторных попытках
        // logger: customLogger // Можно передать свой логгер, реализующий интерфейс IrisLogger
    },

    // [ОПЦИОНАЛЬНО] Настройки прокси
    /* proxy: {
        enabled: true,
        protocol: "http",
        host: "1.2.3.4",
        port: 8080,
        auth: { username: "user", password: "password" }
    },
    */

    // [ОПЦИОНАЛЬНО] Дополнительные заголовки
    headers: {
        "User-Agent": "IrisAPIClientTS/1.0.0",
        "X-Custom-Header": "Value"
    }
};

const api = new IrisApiClient(config);

/**
 * Пример выполнения запросов
 */
async function runDemo() {
    const balance = await api.getBalance();
    const transaction = await api.getTransactions(CurrencyType.Sweets, 0, 5); // CurrencyType указывает для какой валюты запрос.
    
}

runDemo();