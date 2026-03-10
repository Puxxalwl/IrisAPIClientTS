export type ResponeType =
    "send" | // Отправлено
    "send_with" | // Отправлено при ...
    "receive" | // Получено
    "receive_with" | // Получено при ...
    "trade" | // Операции биржы
    "dividends" | // Дивиденты
    "trade_sale_order" | //
    "purchase_tgstars" | // Конвертация тгзв
    "purchase" | // Обмен на тгзв
    "sweets_log" | // Логи ирисок
    "gold_log" | // Логи ирис-голд
    "tgstars_log" | // Логи тгзв
    "buy" | // Покупка
    "sell"; // Продажа