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

```ENV
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

### Обработка ошибок
Все запросы используют функцию `getWithRetry`, которая сразу выбрасывает ошибки.

---

Контакты
Я есть только в Telegram: `@puxalwl` (ID: 6984952764)