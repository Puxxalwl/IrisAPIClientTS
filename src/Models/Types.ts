export interface Balance {
    sweets: number;
    gold: number;
    donate_score: number;
}

export interface Result {
    result:boolean
}

export interface ResultGive {
    result:number
}

export interface HistoryIris {
  id:number
  type: "send"| "receive"
  date:number
  amount: number
  balance:number
  peer_id:number
  to_user_id: number
  details: {
    total:number
    amount?:number
    donate_score?: number
    fee?:number
  }
  comment?:string
  metadata?:undefined
}

interface Update {
  id:number
  type : 'gold_log'|'sweets_log'
  date:number // UNIX
  object:HistoryIris
}

export type UpdateIris = Update[] | []