export type ResponseType =
    "send" | // Отправка
    "send_with" | // Отправка со списанием доп. ресурсов
    "receive" | // Получение
    "receive_with" | // Получение с доп. условиями
    "trade" | // Биржевая операция
    "dividends" | // Дивиденды
    "trade_sale_order" | // Продажа через ордер
    "purchase_tgstars" | // Покупка tgstars за ириски
    "purchase" | // Покупка/обмен
    "sweets_log" | // Событие лога ирисок
    "gold_log" | // Событие лога голды
    "donate_score_log" | // Событие лога очков доната
    "tgstars_log" | // Событие лога tgstars
    "buy" | // Покупка в сделках
    "sell"; // Продажа в сделках