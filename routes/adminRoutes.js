// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { addAdminValidation, createTaskValidation } = require('../middleware/pipline/validateRequest');
const { validationHandler } = require('../middleware/Error');
const authAdminMiddleware = require('../middleware/adminMiddleware/adminMiddleware');

// Define routes for admin registration and login
router.post('/register',addAdminValidation,validationHandler, adminController.register);
router.post('/login',addAdminValidation,validationHandler, adminController.login);
router.post('/task',authAdminMiddleware, createTaskValidation,validationHandler, adminController.createTask);
router.get('/task/:taskId',authAdminMiddleware, adminController.taskDetails);


module.exports = router;
