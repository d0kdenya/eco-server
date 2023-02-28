const Router = require('express')
const router = new Router()
const authController = require('../controllers/authController')

router.get('/activate/:link', authController.activate)
router.post('/refresh', authController.refresh)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/registration', authController.registration)

module.exports = router