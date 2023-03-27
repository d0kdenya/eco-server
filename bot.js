const axios = require('axios')

module.exports = bot => {
  bot.setMyCommands([
    {
      command: '/start',
      description: 'Начальное приветствие'
    },
    {
      command: '/info',
      description: 'Получить информацию о пользователе'
    },
    {
      command: '/auth',
      description: 'Авторизация'
    },
    {
      command: '/upload',
      description: 'Загрузить нарушение!'
    }
  ])

  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/6da/2f4/6da2f40d-a9d2-41a1-8f33-b816439ffe73/192/12.webp')
      return await bot.sendMessage(chatId, `Добро пожаловать в телеграм бот: 'Экологический Проект'`)
    }
    if (text === '/info') {
      return await bot.sendMessage(chatId, `Тебя зовут ${ msg.from.first_name } ${ msg.from.last_name }!`)
    }
    if (text === '/auth') {
      return await bot.sendMessage(chatId, `Для авторизации перейди по ссылке ${ process.env.CLIENT_URL }/login`)
    }
    if (text === '/upload') {
      return await bot.sendMessage(chatId, `Ну давай загрузим!`)
    }

    /*let filePath = ''

    await axios.get(`https://api.telegram.org/bot${ process.env.BOT_TOKEN }/getFile?file_id=${ msg.photo[0].file_id }`)
      .then(function (res) {
        filePath = res.data.result.file_path ? res.data.result.file_path : ''
      })

    if (filePath.length > 0) {
      await axios.get(`https://api.telegram.org/file/bot${ process.env.BOT_TOKEN }/${ filePath }`)
        .then(function (res) {
          console.log('res: ', res)
        })
    } else {
      console.log('GG WP!')
    }*/

    return bot.sendMessage(chatId, 'Я тебя не понимаю! Попробуй ещё раз!')
  })
}