# IrisAPIClientTS — асинхронный клиент для работы с API Iris | Чат-менеджер'а в Telegram на TypeScript/JavaScript, поддерживающий загрузку настроек из `.env` или `IrisSettings.json`, а также работу через прокси.

### (Документация и библиотека не полностью готовы)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
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
  "IrisVersion": "100  
  "IrisUrl": "https://iris-tg.ru/api",
  "botId": "ID_бота",
  "IrisToken": "Iris-Token (получается у @irisism)",
  "proxyUrl": "Proxy"
}
```

### Через .env
Создайте файл `.env`:

```shell
IRIS_VERSION=100
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
    IrisVersion:"100" // Версия для работы с Iris API, можно указать 100 для получение актуальной версии
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
for (const result of ResultSweetsHistory) {
    const date = result.date / 1000;
    const TimeString = new Date(date).ToLocaleString();

    console.log(
        `История путишествий ирисок ((${ResultSweetsHistory.length} записей)):\n\n` +
        `Дата операции: ${TimeString}\n` + 
        `Количество: ${result.amount}\n` +
        `Исходный баланс: ${result.balance}\n` +
        `Пользователь: ${result.to_user_id}\n` +
        `ID операции: ${result.id}\n` + 
        `Тип операции: ${result.type == "take" ? "получение" : "перевод"}\n` +
        `Коммисия: ${result.info.commision}`
    )
}
```
---

### getGoldHistory
Получить историю путишествий ирис-голд

```TypeScript
const ResultGoldHistory = await client.getGoldHistory(0) // offset, если указывать offset+1 то будет как аналог long-polling для получения уведомлений о переводе

for (const result of ResultGoldHistory) {
    const date = result.date / 1000;
    const TimeString = new Date(date).ToLocaleString();

    console.log(
        `История путишествий ирисок (${ResultGoldHistory.length} записей):\n\n` +
        `Дата операции: ${TimeString}\n` + 
        `Количество: ${result.amount}\n` +
        `Исходный баланс: ${result.balance}\n` +
        `Пользователь: ${result.to_user_id}\n` +
        `ID операции: ${result.id}\n` + 
        `Тип операции: ${result.type == "take" ? "получение" : "перевод"}\n` +
        `Коммисия: ${result.info.commision}`
    )
}
```
---

### Обработка ошибок

Все запросы используют функцию `getWithRetry`, которая сразу выбрасывает ошибки.
---

### Контакты

Я есть только в Telegram: `@puxalwl` (ID: 6984952764)