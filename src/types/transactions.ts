import { CurrencyType } from "./enums/currencyType";
import { ResponseType } from "./unionTypes";

export interface TransactionDetails {
    total: number; // Общая сумма списания/начисления
    amount: number; // Сумма для контрагента
    fee: number; // Комиссия
    donate_score: number; // Использованные очки доната
}

export interface BaseTransaction {
    id: number; // ID операции
    date: number; // UNIX-время операции
    type: ResponseType; // Тип операции
    peer_id: number; // ID контрагента
    amount: number; // Сумма операции
    balance: number; // Баланс после операции
    comment?: string; // Комментарий к переводу
}

export interface TransferTransaction extends BaseTransaction {
    to_user_id?: number; // ID получателя (если присутствует)
    details?: TransactionDetails; // Детали списания/комиссии
}

export interface TgStarsTransaction extends BaseTransaction {
    type: "send" | "receive" | "purchase"; // Допустимые типы истории tgstars
}

// Унифицированная запись истории по любой валюте.
export type CurrencyTransaction = TransferTransaction | TgStarsTransaction;

export interface UpdateEvent {
    id: number; // ID события
    type: ResponseType; // Тип события логов
    date: number; // UNIX-время события
    object: CurrencyTransaction; // Объект события
}

export interface UserActivity {
    total: number; // Общая активность
    week: number; // За неделю
    month: number; // За месяц
    day: number; // За сутки
}

export interface UserSpamInfo {
    is_spam: boolean; // Признак спама
    is_ignore: boolean; // Признак игнора
    is_scam: boolean; // Признак скама
}

export interface UserPocketInfo {
    gold: number; // Голда
    coins: number; // Монеты
    sweets: number; // Ириски
    stars: number; // Звезды
    tgstars: number; // Telegram stars
}

export interface UserInfoResultMap {
    reg: number; // UNIX-время регистрации
    activity: UserActivity; // Статистика активности
    spam: UserSpamInfo; // Данные антиспам-проверки
    stars: number; // Звездность
    pocket: UserPocketInfo; // Содержимое мешка
}

export interface GiveOptions {
    comment?: string; // Комментарий к переводу
    withoutDonateScore?: boolean; // Отключить списание очков доната
    donateScore?: number; // Лимит списания очков доната
}

export interface TradeExecutionResult {
    done_volume: number; // Исполненный объем
    sweets_spent?: number; // Потрачено ирисок при покупке
    sweets_received?: number; // Получено ирисок при продаже
    new_order?: {
        volume: number; // Объем новой заявки
        price: number; // Цена новой заявки
        id: number; // ID новой заявки
    };
}

export interface TradeCancelResult {
    gold: number; // Возвращенная голда
    sweets: number; // Возвращенные ириски
}

export interface TradeBookEntry {
    volume: number; // Объем заявки
    price: number; // Цена заявки
}

export interface TradeOrderbook {
    buy: TradeBookEntry[]; // Заявки на покупку
    sell: TradeBookEntry[]; // Заявки на продажу
}

export interface TradeDeal {
    id: number; // ID сделки
    group_id: number; // ID группы связанных сделок
    date: number; // UNIX-время сделки
    price: number; // Цена сделки
    volume: number; // Объем сделки
    type: "buy" | "sell"; // Сторона сделки
}

export interface NftObjectPart {
    emoji: string; // Эмодзи атрибута
    custom_emoji_id: string | number; // ID кастомного эмодзи
    name: string; // Название атрибута
    id: number; // ID атрибута
    rarity_per_mile: number; // Редкость на тысячу
}

export interface NftInfo {
    number: number; // Порядковый номер NFT
    symbol: NftObjectPart; // Символ
    url_name: string; // URL-имя
    background: Omit<NftObjectPart, "emoji" | "custom_emoji_id">; // Фон
    owner_id: number; // ID владельца
    name: string; // Название
    model: NftObjectPart; // Модель
    id: number; // ID NFT в Iris
}

export interface NftListItem extends Omit<NftInfo, "owner_id"> {
    date_add: number; // UNIX-время добавления
}

export interface NftHistoryItem {
    date: number; // UNIX-время операции
    nft_id: number; // ID NFT
    id: number; // ID записи
    type: string; // Тип операции
    peer_id: number; // ID контрагента
}

export interface TgStarsPrice {
    tgstars: number; // Количество tgstars
    sweets: number; // Стоимость в ирисках
}

export type NumericAmountByCurrency<C extends CurrencyType> = C extends CurrencyType.Sweets ? number : number;
