const Router = require('express')
const router = new Router()
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const adminController = require('../controllers/adminController')

router.get('/allUsers', roleMiddleware(['ADMIN']), authMiddleware, adminController.getAllUsers)
router.get('/allGovernments', roleMiddleware(['ADMIN']), authMiddleware, adminController.getAllGovernments)
router.get('/allDepartments', roleMiddleware(['ADMIN']), authMiddleware, adminController.allDepartments)
router.get('/department/:id', roleMiddleware(['ADMIN']), authMiddleware, adminController.getDepartmentById)

router.post('/activateGovernment', roleMiddleware(['ADMIN']), authMiddleware, adminController.activateGovernment)
// router.post('/registerGovernment', roleMiddleware(['ADMIN']), authMiddleware, adminController.registerGovernment)

router.post('/banUser/:id', roleMiddleware(['ADMIN']), authMiddleware, adminController.banUser)

// router.post('/banGovernment', roleMiddleware(['ADMIN']), authMiddleware, adminController.banGovernment)
router.post('/createDepartment', roleMiddleware(['ADMIN']), authMiddleware, adminController.createDepartment)
router.post('/setDepartment', roleMiddleware(['ADMIN']), authMiddleware, adminController.setDepartment)
router.post('/unsetDepartment', roleMiddleware(['ADMIN']), authMiddleware, adminController.unsetDepartment)
router.patch('/changeDepartment', roleMiddleware(['ADMIN']), authMiddleware, adminController.changeDepartment)

router.delete('/deleteUser/:id', roleMiddleware(['ADMIN']), authMiddleware, adminController.deleteUser)

// router.delete('/deleteGovernment', roleMiddleware(['ADMIN']), authMiddleware, adminController.deleteGovernment)
router.delete('/deleteDepartment', roleMiddleware(['ADMIN']), authMiddleware, adminController.deleteDepartment)

module.exports = router