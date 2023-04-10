const { botOptions, botLocation, violationOptions } = require('./options')
const { User, Violation } = require('./models/models')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const uuid = require('uuid')

module.exports = bot => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text && text.length > 7 && text.split(' ')[0] === '/start') {
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
    const data = msg.data
    const chatId = msg.message.chat.id

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
      return await bot.sendMessage(chatId, `Для авторизации перейди по ссылке ${ process.env.CLIENT_URL }login/`)
    } else if (data === '/registration') {
      return await bot.sendMessage(chatId, `Для регистрации перейди по ссылке ${ process.env.CLIENT_URL }register/`)
    } else if (data === '/upload') {
      await bot.sendMessage(chatId, 'Для начала загрузи свой файлик!')
      bot.on('message', async (msg) => {
        const image = msg.photo[msg.photo.length - 1].file_id ? await bot.getFile(msg.photo[msg.photo.length - 1].file_id) : ''

        if (!image) {
          return await bot.sendMessage(chatId, 'Ошибка загрузки изображения!', botOptions)
        }
        const user = await User.findOne({ where: { chatId: chatId } })
        await Violation.create({ file: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${image.file_path}`, userId: user.id })
        return createViolation(chatId)
      })
    } else if (data === '/commands') {
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    } else if (data === '/name') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      if (!violation.length > 0) {
        return await bot.sendMessage(chatId, 'Ошибка! Нарушение не загружено!', botOptions)
      }
      if (violation[violation.length - 1].name) {
        return await bot.sendMessage(chatId, 'Ошибка! Имя уже задано!', violationOptions)
      }
      await bot.sendMessage(chatId, 'Введите имя:')
      bot.on('message', async (msg) => {
        console.log('msg: ', msg)
        console.log('user.id: ', user.id)
        console.log('violation[violation.length - 1].id: ', violation[violation.length - 1].id)
        await Violation.update({ name: msg.text }, { where: { userId: user.id, id: violation[violation.length - 1].id } })
        return await bot.sendMessage(chatId, 'Успешно задали имя!', violationOptions)
      })
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

  const createViolation = async (chatId, url) => {
    console.log('url:', url)
    await bot.sendMessage(chatId, 'Загрузили!')
    await bot.sendMessage(chatId, 'Нужно заполнить данные:', violationOptions)
  }
}