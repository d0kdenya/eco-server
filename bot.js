const { botOptions, botLocation } = require('./options')
const { User } = require('./models/models')
const axios = require('axios')

module.exports = bot => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    console.log('text: ', text)

    if (text.split(' ')[0] === '/start') {
      const token = text.split(' ')[1]

      const user = await User.findOne({ where: { authToken: token } })

      if (!user) {
        return await bot.sendMessage(chatId, 'Ошибка авторизации!')
      }
      await User.update({ chatId }, { where: { id: user.id, authToken: token } })
      return await bot.sendMessage(chatId, 'Успешная авторизация!', botOptions)
    }

    return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/start') {
      await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/6da/2f4/6da2f40d-a9d2-41a1-8f33-b816439ffe73/192/12.webp')
      await bot.sendMessage(chatId, `Добро пожаловать в телеграм бот: 'Экологический Проект'`)
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    } else if (data === '/info') {
      if (msg.from.last_name) {
        await bot.sendMessage(chatId, `Тебя зовут ${ msg.from.first_name } ${ msg.from.last_name }!`)
        return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
      }
      await bot.sendMessage(chatId, `Тебя зовут ${ msg.from.first_name }!`)
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    } else if (data === '/login') {
      return await bot.sendMessage(chatId, `Для авторизации перейди по ссылке ${ process.env.CLIENT_URL }login/${ chatId }`)
    } else if (data === '/registration') {
      return await bot.sendMessage(chatId, `Для регистрации перейди по ссылке ${ process.env.CLIENT_URL }register/${ chatId }`)
    } else if (data === '/upload') {
      await bot.sendMessage(chatId, `Ну давай загрузим!`)
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    } else if (data === '/commands') {
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    } else {
      await bot.sendMessage(chatId, 'Я тебя не понимаю! Попробуй ещё раз!')
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    }
  })

  bot.on('location', async (msg) => {
    const chatId = msg.chat.id
    console.log(msg.location.latitude)
    console.log(msg.location.longitude)
    return await bot.sendMessage(chatId, `Твоя широта: ${ msg.location.latitude } и долгота: ${ msg.location.longitude }`)
  })
}