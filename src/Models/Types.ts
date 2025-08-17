export interface Balance {
    sweets: number;
    gold: number;
    donate_score: number;
}

export interface Result {
    result:boolean
}

export interface HistoryInfo {
    donateScore: number;
    sweets: number;
    commission: number;
    id_chat: number;
    id_local: number;
}

export interface HistoryEntry {
    date: number;
    amount: number;
    balance: number;
    to_user_id: number;
    id: number;
    type?: string;
    info?: HistoryInfo;
}

export interface SweetsFull {
    sweets: number;
    donate_score: number;
    result?: string;
    history: HistoryEntry[];
}