import { IrisApiClient } from "irisapiclientts"; // JavaScript: const { IrisApiClient } = require("irisapiclientts")

/*
 * env: boolean — true = брать настройки из .env, false = из .json (по умолчанию IrisSettings.json)
 * proxyStatus: boolean — использовать ли прокси.
 *                       Для Json-конфига указать поле proxyUrl.
 *                       Для .env — переменную PROXY_URL.
 */
const IrisClient = IrisApiClient.create({ env: false, proxyStatus: true });

// Пример ручной инициализации
// const config = {
//     IrisVersion: "100"
//     IrisUrl: "https://iris-tg.ru/api",
//     botId: "123456789",
//     IrisToken: "123456789:Abv",
//     proxyStatus: true,
//     proxyUrl: "http://127.0.0.1:8080" // proxyUrl указывать необязательно, если proxyStatus = false
// }
// const IrisClient = new IrisApiClient({
//     config,
//     proxyStatus: true
// })

// Запуск: npm run start

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    try {
        // Получение баланса
        const balance = await IrisClient.getBalance();
        console.log(`В мешке бота: ${balance.sweets} ирисок, ${balance.gold} ирис-голд, ${balance.donate_score} очков доната`);
        await delay(5000);

        // Перевод ирисок
        const giveSweetsResult = await IrisClient.giveSweets(
            6984952764,
            10.5,
            {
                comment: "За такую прекрасную библиотеку", // комментарий к переводу (по умолчанию "")
                withoutDonateScore: true // учитывать ли очки доната (по умолчанию true)
            }
        );
        if (giveSweetsResult?.result) {
            console.log(`Перевод успешен`);
        }

        await delay(5000);

        // Открыть/закрыть мешок
        const openBagResult = await IrisClient.openBag(true); // true = открыть, false = закрыть
        console.log(`Ответ Iris API: ${openBagResult.result}`);
        await delay(5000);

        // Разрешить/запретить переводы для всех
        const allowAllResult = await IrisClient.allowAll(true); // true = разрешить, false = запретить
        console.log(`Ответ Iris API: ${allowAllResult.result}`);
        await delay(5000);

        // Разрешить/запретить переводы конкретному пользователю
        const allowUserResult = await IrisClient.allowUser(true, 123456789);
        console.log(`Ответ Iris API: ${allowUserResult.result}`);

        const ResultSweetsHistory = await IrisClient.getSweetsHistory(0) // offset, если указывать offset+1 то будет как аналог long-polling для получения уведомлений о переводе
        for (const result of ResultSweetsHistory) {
            const date = result.date;
            const TimeString = new Date(date).toLocaleString();

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

        const ResultGoldHistory = await IrisClient.getGoldHistory(0) // offset, если указывать offset+1 то будет как аналог long-polling для получения уведомлений о переводе

        for (const result of ResultGoldHistory) {
            const date = result.date;
            const TimeString = new Date(date).toLocaleString();

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

    } catch (err: any) {
        console.log(`Произошла ошибка: ${err.message}`);
    }
})();