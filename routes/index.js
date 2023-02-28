const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const authRouter = require('./authRouter')
const governmentRouter = require('./governmentRouter')
const adminRouter = require('./adminRouter')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/government', governmentRouter)
router.use('/admin', adminRouter)

module.exports = router

