export enum apiPath {
  Balance = "pocket/balance", // Баланс мешка бота
  PocketEnable = "pocket/enable", // Открыть мешок
  PocketDisable = "pocket/disable", // Закрыть мешок
  PocketAllowAll = "pocket/allow_all", // Разрешить переводы всем
  PocketDenyAll = "pocket/deny_all", // Запретить переводы всем
  PocketAllowUser = "pocket/allow_user", // Разрешить переводы пользователю
  PocketDenyUser = "pocket/deny_user", // Запретить переводы пользователю
  TgStarsBuy = "pocket/tgstars/buy", // Купить tgstars
  TgStarsPrice = "pocket/tgstars/price", // Рассчитать цену tgstars
  UpdatesGet = "updates/getUpdates", // Получить события логов
  TradeBuy = "trade/buy", // Покупка голды
  TradeSell = "trade/sell", // Продажа голды
  TradeCancelPrice = "trade/cancel_price", // Отмена заявок по цене
  TradeCancelAll = "trade/cancel_all", // Отмена всех заявок
  TradeCancelPart = "trade/cancel_part", // Частичная отмена заявки
  TradeOrderbook = "trade/orderbook", // Стакан заявок
  TradeDeals = "trade/deals", // История сделок
  NftGive = "nft/give", // Передача NFT
  NftInfo = "nft/info", // Информация об NFT
  NftList = "nft/list", // Список NFT
  NftHistory = "nft/history", // История NFT
  UserInfoReg = "user_info/reg", // Дата регистрации пользователя
  UserInfoActivity = "user_info/activity", // Активность пользователя
  UserInfoSpam = "user_info/spam", // Статус spam/ignore/scam
  UserInfoStars = "user_info/stars", // Звездность пользователя
  UserInfoPocket = "user_info/pocket", // Мешок пользователя
  LastVersion = "last_version", // Текущая версия API
  IrisAgents = "iris_agents" // Список агентов Iris
}

export const givePathByCurrency: Record<string, string> = {
  sweets: "pocket/sweets/give", // Перевод ирисок
  gold: "pocket/gold/give", // Перевод голды
  donate_score: "pocket/donate_score/give", // Перевод очков доната
  tgstars: "pocket/tgstars/give" // Перевод tgstars
};

export const historyPathByCurrency: Record<string, string> = {
  sweets: "pocket/sweets/history", // История ирисок
  gold: "pocket/gold/history", // История голды
  donate_score: "pocket/donate_score/history", // История очков доната
  tgstars: "pocket/tgstars/history" // История tgstars
};