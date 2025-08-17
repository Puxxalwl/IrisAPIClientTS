// JavaScript example

const { IrisApiClient } = require("irisapiclientts");

const IrisClient = IrisApiClient.create(undefined, true); // configPath используется когда данные берутся с конфига .json по умолчанию IrisSettings.json, но если использовать env нужно передать undefined и env true

// Запуск: node src/index.js

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        const balance = await IrisClient.getBalance(); // Получить баланс
        console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`);
        await delay(5000);

        const giveSweetsResult = await IrisClient.giveSweets(
            6984952764,
            10.5,
            true,
            "За такую прекрасную библиотеку"
        ); // Перевод ирисок
        if (giveSweetsResult && giveSweetsResult.result) {
            console.log(`Перевод успешен\nкому: ${giveSweetsResult.history.map(h => h.to_user_id).join(", ")}`);
        } else {
            console.log(`Перевод не удался по неизвестной причине`);
        }
        await delay(5000);

        const openBagResult = await IrisClient.openBag(true); // status:boolean открыть либо закрыть мешок
        console.log(`Ответ Iris API: ${openBagResult.result}`);
        await delay(5000);

        const allowAllResult = await IrisClient.allowAll(true); // status:boolean разрешить либо запретить всем переводы
        console.log(`Ответ Iris API: ${allowAllResult.result}`);
        await delay(5000);

        const allowUserResult = await IrisClient.allowUser(true, 123456789);
        console.log(`Ответ Iris API:${allowUserResult.result}`);
    } catch (err) {
        console.log(`Произошла неизвестная ошибка ${err.message}`);
    }
})();