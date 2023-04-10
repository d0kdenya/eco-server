module.exports = {
    botOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Начать', callback_data: '/start'}],
                [{text: 'Информация о пользователе', callback_data: '/info'}],
                [{text: 'Войти', callback_data: '/login'}],
                [{text: 'Зарегистрироваться', callback_data: '/registration'}],
                [{text: 'Загрузить нарушение', callback_data: '/upload'}],
                [{text: 'Список команд', callback_data: '/commands'}]
            ]
        })
    },

    garbageLocation: {
         reply_markup: JSON.stringify({
             inline_keyboard: [
                 [{text: 'Бытовой мусор', callback_data: '/household'}, {text: 'Спецотходы', callback_data: '/special'}],
                 [{text: 'Промышленный мусор', callback_data: '/industrial'}, {text: 'Другой', callback_data: '/other'}],
             ]
         })
    },

    violationOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Ввести название и описание нарушения', callback_data: '/name'}],
                [{text: 'Добавить классификацию мусора', callback_data: '/class'}],
                [{text: 'Скинуть геолокацию', callback_data: '/location'}],
            ]
        })
    }
}