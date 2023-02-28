const Router = require('express')
const router = new Router()
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const governmentController = require('../controllers/governmentController')

router.get('/', roleMiddleware(['GOVERNMENT', 'ADMIN']), authMiddleware, governmentController.getProfile)

router.get('/getViolations', roleMiddleware(['GOVERNMENT', 'ADMIN']), authMiddleware, governmentController.getViolations)

router.patch('/updateProfile', roleMiddleware(['GOVERNMENT', 'ADMIN']), authMiddleware, governmentController.updateProfile)

router.post('/changeViolationStatus', roleMiddleware(['GOVERNMENT', 'ADMIN']), authMiddleware, governmentController.changeViolationStatus)


module.exports = router