const { botOptions, violationOptions, garbageLocation } = require('./options')
const { User, Violation } = require('./models/models')

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

    if (msg?.photo) {
      const image = msg.photo[msg.photo.length - 1].file_id ? await bot.getFile(msg.photo[msg.photo.length - 1].file_id) : ''

      if (!image) {
        return await bot.sendMessage(chatId, 'Ошибка загрузки изображения!', botOptions)
      }
      const user = await User.findOne({ where: { chatId: chatId } })
      if (!user) {
        return await bot.sendMessage(chatId, 'Не авторизирован!', botOptions)
      }
      await Violation.create({ file: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${image.file_path}`, userId: user.id })
      return createViolation(chatId)
    }
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
      return await bot.sendMessage(chatId, 'Для начала загрузи свой файлик!')
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
      } else if (violation[violation.length - 1].description) {
        return await bot.sendMessage(chatId, 'Ошибка! Описание уже задано!', violationOptions)
      }
      await bot.sendMessage(chatId, 'Введите имя и описание (Каждое с новой строчки):')
      console.log('violationOptions: ', violationOptions)
      bot.on('message', async msg => {
        if (msg?.location) return
        await Violation.update({ name: msg.text.split('\n')[0], description: msg.text.split('\n')[1] }, { where: { userId: user.id, id: violation[violation.length - 1].id } })
        return await bot.sendMessage(chatId, 'Успешно задали имя и описание для нарушения!', violationOptions)
      })
    } else if (data === '/location') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      if (!violation.length > 0) {
        return await bot.sendMessage(chatId, 'Ошибка! Нарушение не загружено!', botOptions)
      }
      if (violation[violation.length - 1].latitude || violation[violation.length - 1].longitude) {
        return await bot.sendMessage(chatId, 'Ошибка! Геолокация уже задана!', violationOptions)
      }
      await bot.sendMessage(chatId, 'Добавьте геолокацию:')
      bot.on('location', async (msg) => {
        const chatId = msg.chat.id
        await bot.sendMessage(chatId, `Твоя широта: ${ msg.location.latitude } и долгота: ${ msg.location.longitude }`)

        await Violation.update({
          latitude: msg.location.latitude,
          longitude: msg.location.longitude,
          garbageClassId: violation[violation.length - 1].garbageClassId ? violation[violation.length - 1].garbageClassId : 4
        }, { where: { userId: user.id, id: violation[violation.length - 1].id }})
        return await bot.sendMessage(chatId, 'Успешно задали геолокацию!', botOptions)
      })
    } else if (data === '/class') {
      return await bot.sendMessage(chatId, 'Окей, выбирай класс!', garbageLocation)
    } else if (data === '/household') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      await Violation.update({ garbageClassId: 1 }, { where: { userId: user.id, id: violation[violation.length - 1].id }})
      return await bot.sendMessage(chatId, 'Успешно выбрали класс!', botOptions)
    } else if (data === '/special') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      await Violation.update({ garbageClassId: 2 }, { where: { userId: user.id, id: violation[violation.length - 1].id }})
      return await bot.sendMessage(chatId, 'Успешно выбрали класс!', botOptions)
    } else if (data === '/industrial') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      await Violation.update({ garbageClassId: 3 }, { where: { userId: user.id, id: violation[violation.length - 1].id }})
      return await bot.sendMessage(chatId, 'Успешно выбрали класс!', botOptions)
    } else if (data === '/other') {
      const user = await User.findOne({ where: { chatId } })
      const violation = await Violation.findAll({ where: { userId: user.id }, order: ['id'] })
      await Violation.update({ garbageClassId: 4 }, { where: { userId: user.id, id: violation[violation.length - 1].id }})
      return await bot.sendMessage(chatId, 'Успешно выбрали класс!', botOptions)
    } else {
      await bot.sendMessage(chatId, 'Я тебя не понимаю! Попробуй ещё раз!')
      return await bot.sendMessage(chatId, 'Выбирай команду:', botOptions)
    }
  })

  const createViolation = async (chatId, url) => {
    await bot.sendMessage(chatId, 'Загрузили!')
    await bot.sendMessage(chatId, 'Нужно заполнить данные:', violationOptions)
  }
}