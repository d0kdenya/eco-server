const Router = require('express')
const userController = require("../controllers/userController");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const router = new Router()

router.get('/', roleMiddleware(['USER', 'ADMIN']), authMiddleware, userController.getProfile)
router.get('/violations', roleMiddleware(['USER', 'ADMIN']), authMiddleware, userController.getAllUsersViolations)

router.patch('/updateProfile', roleMiddleware(['USER', 'ADMIN']), authMiddleware, userController.updateProfile)
router.post('/uploadViolation', roleMiddleware(['USER', 'ADMIN']), authMiddleware, uploadMiddleware.any('image'), userController.uploadViolation)
router.post('/setViolationInfo', roleMiddleware(['USER', 'ADMIN']), authMiddleware, userController.setViolationInfo)

router.post('/sendViolation', roleMiddleware(['USER', 'ADMIN']), authMiddleware, userController.sendViolation)

router.post('/uploadProfilePhoto', roleMiddleware(['USER', 'ADMIN']), authMiddleware, uploadMiddleware.any('image'), userController.uploadProfilePhoto)
router.delete('/deleteProfilePhoto', roleMiddleware(['USER', 'ADMIN']), authMiddleware, uploadMiddleware.any('image'), userController.deleteProfilePhoto)


module.exports = router
