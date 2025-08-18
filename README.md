# IrisApiClient — асинхронный клиент для работы с API Iris | Чат-менеджер'а в Telegram на TypeScript/JavaScript
### (Документация и библиотека не полностью готовы)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
---

## Оглавление
1. [Установка](#установка)  
2. [Конфигурация](#конфигурация)  
3. [Быстрый старт](#быстрый-старт)  
4. [Методы клиента](#методы-клиента)  
   - [getBalance](#getbalance)  
   - [giveSweets](#givesweets)  
   - [openBag](#openbag)  
   - [allowAll](#allowall)  
   - [allowUser](#allowuser)  
5. [Обработка ошибок](#обработка-ошибок)  
6. [Контакты](#контакты)  

---

## Установка

Установка пакета через npm:

```bash
npm i IrisAPIClientTS
```

---

## Конфигурация

Создайте файл **IrisSettings.json** в корне проекта:

```JSON
{
  "IrisApi": {
    "IrisUrl": "https://iris-tg.ru/api",
    "botId": "ID_бота",
    "IrisToken": "Iris-Token (получается у @irisism)"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  }
}
```
Или же используйте **.env** передав undefined для `configPath` и true для `env` c параметрами в .env `IRIS_BOT_ID` и `IRIS_TOKEN` при создании клиента через **create()** 

---

### Быстрый старт

TypeScript:
```TypeScript
import { IrisApiClient } from "irisapiclientts";

const client = IrisApiClient.create(undefined, true); // configPath используется когда данные берутся с конфига .json по умолчанию IrisSettings.json, но если использовать env нужно передать undefined и env true

const balance = await client.getBalance()
console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`)

```

JavaScript:
```JavaScript
const { IrisApiClient } = require("irisapiclientts");

const client = IrisApiClient.create(undefined, true); // configPath используется когда данные берутся с конфига .json по умолчанию IrisSettings.json, но если использовать env нужно передать undefined и env true

const balance = await client.getBalance()
console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`)


```

---

## Методы клиента

### getBalance

Получение текущего баланса.

```TypeScript
const balance = await client.getBalance();
console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`)
```

---

### giveSweets

Передача ирисок другому пользователю.

```TypeScript
const giveSweetsResult = await IrisClient.giveSweets(
    6984952764, // userId:long — индификатор пользователя в тг
    10.5, // sweets:number — кол-во передаваемых ирисок
    true, // withoutScoreDonate:boolean что-то там
    "За такую прекрасную библиотеку" // comment:string (по умолчанию пусто) комментарий к переводу 
)
if (giveSweetsResult && giveSweetsResult.result) {
    console.log(`Перевод успешен\nкому: ${giveSweetsResult.history.forEach(h => { h.to_user_id })}`);
} else {
    console.log(`Перевод не удался по неизвестной причине`)
}
```

---

### openBag

Открытие или закрытие мешка для переводов.

```TypeScript
await client.openBag(true);  // открыть
await client.openBag(false); // закрыть
```


---

### allowAll

Разрешить или запретить переводы для всех.

```TypeScript
await client.allowAll(true);  // разрешить
await client.allowAll(false); // запретить
```


---

### allowUser

Разрешить или запретить переводы для конкретного пользователя.

```TypeScript
await client.allowUser(true, 123456789);  // разрешить
await client.allowUser(false, 123456789); // запретить
```

---

### Обработка ошибок

Все запросы используют функцию `getWithRetry`, которое сразу выдает ошибки

---

### Контакты

Я есть лишь в **Telegram** и только с username: @puxalwl (ID: 6984952764)