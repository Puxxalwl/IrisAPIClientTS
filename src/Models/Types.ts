export interface Balance {
    sweets: number;
    gold: number;
    donate_score: number;
}

export interface Result {
    result:boolean
}


export interface History {
    date:number;
    amount:number;
    balance:number;
    to_user_id:number;
    id:number;
    type:string;
    info:Info
}

interface Info {
    donateScore:number|null
    sweets:number|null
    gold:number|null
    commision:number|null
}