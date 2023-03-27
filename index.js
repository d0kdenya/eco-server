require('dotenv').config()

const TelegramApi = require('node-telegram-bot-api')
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const authMiddleware = require('./middlewares/authMiddleware')
const errorMiddleware = require('./middlewares/errorHandlingMiddleware')
const path = require('path')
const botFunc = require('./bot')

let bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true })

/*const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '1', callback_data: '1' }, { text: '2', callback_data: '2' }, { text: '3', callback_data: '3' }],
      [{ text: '4', callback_data: '4' }, { text: '5', callback_data: '5' }, { text: '6', callback_data: '6' }],
      [{ text: '7', callback_data: '7' }, { text: '8', callback_data: '8' }, { text: '9', callback_data: '9' }],
      [{ text: '0', callback_data: '0' }]
    ]
  })
}*/


const PORT = process.env.PORT || 5000
const app = express()


app.use(cors())
app.use(express.json())

app.use('/api', router)
app.use('/api/profile/uploads/', authMiddleware, express.static(path.resolve(__dirname, 'uploads')))

app.use(cookieParser())
app.use(errorMiddleware)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    await botFunc(bot)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}
start()