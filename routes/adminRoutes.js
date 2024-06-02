// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { addAdminValidation, createTaskValidation, createInventoryValidation ,updateInventoryValidation} = require('../middleware/pipline/validateRequest');
const { validationHandler } = require('../middleware/Error');
const authAdminMiddleware = require('../middleware/adminMiddleware/adminMiddleware');

// Define routes for admin registration and login
router.post('/register',addAdminValidation,validationHandler, adminController.register);
router.post('/login',addAdminValidation,validationHandler, adminController.login);
router.post('/task',authAdminMiddleware, createTaskValidation,validationHandler, adminController.createTask);
router.get('/task/:taskId',authAdminMiddleware, adminController.taskDetails);
router.get('/task/delete/:taskId',authAdminMiddleware, adminController.DeleteTaskCheckList);
router.get('/task', authAdminMiddleware, adminController.allTask);
router.post('/inventory',authAdminMiddleware, createInventoryValidation,validationHandler, adminController.createInventory);
router.get('/inventory', authAdminMiddleware, adminController.getAllInventory);
router.put('/inventory/:itemId', authAdminMiddleware,updateInventoryValidation,validationHandler, adminController.updateInventory);


module.exports = router;
