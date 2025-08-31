# IrisAPIClientTS — асинхронный клиент для работы с API Iris | Чат-менеджер'а в Telegram на TypeScript/JavaScript, поддерживающий загрузку настроек из `.env` или `IrisSettings.json`, а также работу через прокси.


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

# Support exclusively: Iris API v0.2
---

---

## 📑 Оглавление
1. [Установка](#установка)  
2. [Конфигурация](#конфигурация)  
   - [Через JSON](#через-json)  
   - [Через .env](#через-env)  
   - [Настройка прокси](#настройка-прокси)  
3. [Быстрый старт](#быстрый-старт)  
   - [Авто-загрузка конфига](#авто-загрузка-конфига)  
   - [Ручная конфигурация](#ручная-конфигурация)  
4. [Методы клиента](#методы-клиента)  
   - [getBalance](#getbalance)  
   - [giveSweets](#givesweets)  
   - [openBag](#openbag)  
   - [allowAll](#allowall)  
   - [allowUser](#allowuser)
   - [getSweetsHistory](#getsweetshistory)
   - [getGoldHistory](#getgoldhistory)
   - [getUpdates](#getupdates)
5. [Обработка ошибок](#обработка-ошибок)  
6. [Контакты](#контакты)  

---

## 📦 Установка

```bash
npm i irisapiclientts
```

---

## Конфигурация

### Через JSON
Создайте файл `IrisSettings.json` в **корне проекта**:

```JSON
{
  "IrisUrl": "https://iris-tg.ru/api",
  "botId": "ID_бота",
  "IrisToken": "Iris-Token (получается у @irisism)",
  "proxyUrl": "Proxy"
}
```

### Через .env
Создайте файл `.env`:

```shell
IRIS_URL=https://iris-tg.ru/api
IRIS_BOT_ID=ID_бота
IRIS_TOKEN=Iris-Token
PROXY_URL=Proxy
```

Затем при инициализации передайте `env`: **true**:

```TypeScript
const client = IrisApiClient.create({ env: true, proxyStatus: true });
```
---

### Настройка прокси

# Для работы с прокси:
- Если используете JSON-конфиг, укажите "proxyUrl".
- Если `.env`, добавьте переменную `PROXY_URL`.
- В обоих случаях установите proxyStatus: true при создании клиента.

---

## Быстрый старт

### Авто-загрузка конфига:

```TypeScript
import { IrisApiClient } from "irisapiclientts";

const IrisClient = IrisApiClient.create({ env: true, proxyStatus: true });

const balance = await IrisClient.getBalance();
console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`);
```

---

### Ручная конфигурация:

```TypeScript
const config = {
    IrisUrl: "https://iris-tg.ru/api",
    botId: "123456789",
    IrisToken: "123456789:Abv",
    proxyStatus: true,
    proxyUrl: "Proxy"
}
const IrisClient = new IrisApiClient({
    config,
    proxyStatus: true
});
```

---

## Методы клиента

### getBalance
Получение текущего баланса:

```TypeScript
const balance = await client.getBalance();
console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`);
```
---

### giveSweets
Передача ирисок пользователю:

```TypeScript
const giveSweetsResult = await client.giveSweets(
    6984952764, // userId — тг ид кому отправляете
    10.5, // sweets — количество
    {
      comment: "За такую прекрасную библиотеку",
      withoutDonateScore: true
    }
);

if (giveSweetsResult && giveSweetsResult.result) {
    console.log(`Перевод успешен\nкому: ${giveSweetsResult.history.forEach(h => { h.to_user_id })}`);
} else {
    console.log(`Перевод не удался по неизвестной причине`);
}
```
---

### openBag
Открытие или закрытие мешка:

```TypeScript
await client.openBag(true);  // открыть
await client.openBag(false); // закрыть
```
---

### allowAll
Разрешить или запретить переводы всем:

```TypeScript
await client.allowAll(true);  // разрешить
await client.allowAll(false); // запретить
```
---

### allowUser
Разрешить или запретить переводы конкретному пользователю:

```TypeScript
await client.allowUser(true, 123456789);  // разрешить
await client.allowUser(false, 123456789); // запретить
```
---

### getSweetsHistory
Получить историю путишествий ирисок

```TypeScript
const ResultSweetsHistory = await client.getSweetsHistory(0) // offset, если указывать offset+1 то будет как аналог long-polling для получения уведомлений о переводе

if (ResultSweetsHistory.length === 0) {
    console.log("История отсутствует")
    return
}

for (const result of ResultSweetsHistory) {
    const date = result.date / 1000;
    const TimeString = new Date(date).ToLocaleString();

    console.log(
        `История путишествий ирисок (${ResultSweetsHistory.length} записей):\n\n` +
        `Дата операции: ${DateString}\n` +
        `Количество: ${result.amount}\n` +
        `Новый баланс: ${result.balance}\n` +
        `Контрагент: ${result.peer_id}\n` +
        `ID операции: ${result.id}\n` +
        `Тип операции: ${result.type === "receive" ? "получение" : "отправка"}\n` +
        `Общая сумма: ${result.details.total}\n` +
        `Получил контрагент: ${result.details.amount}\n` +
        `Съедено очков доната: ${result.details.donate_score ?? 0}\n` +
        `Комиссия: ${result.details.fee ?? 0}\n` +
        `Комментарий: ${result.comment || "—"}`
    )
}
```
---

### getGoldHistory
Получить историю путишествий ирис-голд

```TypeScript
const ResultGoldHistory = await client.getGoldHistory(0) // offset, если указывать offset+1 то будет как аналог long-polling для получения уведомлений о переводе

if (ResultGoldHistory.length === 0) {
    console.log("История отсутствует")
    return
}

for (const result of ResultGoldHistory) {
    const DateString = new Date(result.date).ToLocaleString();

    console.log(
        `История путешествий ирисок (${ResultGoldHistory.length} записей):\n\n` +
        `Дата операции: ${DateString}\n` +
        `Количество: ${result.amount}\n` +
        `Новый баланс: ${result.balance}\n` +
        `Контрагент: ${result.peer_id}\n` +
        `ID операции: ${result.id}\n` +
        `Тип операции: ${result.type === "receive" ? "получение" : "отправка"}\n` +
        `Общая сумма: ${result.details.total}\n` +
        `Получил контрагент: ${result.details.amount}\n` +
        `Съедено очков доната: ${result.details.donate_score ?? 0}\n` +
        `Комиссия: ${result.details.fee ?? 0}\n` +
        `Комментарий: ${result.comment || "—"}`
    );
}
```
---

### getUpdates
Получить логи ирисок и ирис-голд

```TypeScript
const LogsResult = await client.getUpdates()

if (LogsResult.length == 0) {
    console.log(`Логи отсутствуют`);
    return
}

for (const result of LogsResult) {
    const DateString = new Date(result.date).toLocaleString();
    const object = result.object;
    const ObjectDate = new Date(object.date).toLocaleString()

    console.log(
        `=== данные логов ===\n\n` + 
        `ID логов: ${result.id}\n` +
        `Дата: ${DateString}\n` + 
        `Логи на: ${result.type == 'sweets_log' ? 'ириски' : 'ирис-голд'}\n` +
        `=== история логов ===\n\n` +
        `Дата операции: ${DateString}\n` +
        `Количество: ${result.amount}\n` +
        `Новый баланс: ${result.balance}\n` +
        `Контрагент: ${result.peer_id}\n` +
        `ID операции: ${result.id}\n` +
        `Тип операции: ${result.type === "receive" ? "получение" : "отправка"}\n` +
        `Общая сумма: ${result.details.total}\n` +
        `Получил контрагент: ${result.details.amount}\n` +
        `Съедено очков доната: ${result.details.donate_score ?? 0}\n` +
        `Комиссия: ${result.details.fee ?? 0}\n` +
        `Комментарий: ${result.comment || "—"}`
    )
}
```

---

### Обработка ошибок

Все запросы используют функцию `getWithRetry`, которая выбрасывает ошибки, поэтому необходимо делать через: try-catch
---

### Контакты

Я есть только в Telegram: `@puxalwl` (ID: 6984952764)