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

    // botLocation: {
    //     reply_markup: JSON.stringify({
    //         inline_keyboard: [
    //             [{text: 'Скинуть геолокацию', callback_data: '/location'}]
    //         ]
    //     })
    // },

    violationOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Ввести название нарушения', callback_data: '/name'}],
                [{text: 'Ввести описание нарушения', callback_data: '/description'}],
                [{text: 'Скинуть геолокацию', callback_data: '/location'}],
            ]
        })
    }
}