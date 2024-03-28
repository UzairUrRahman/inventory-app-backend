// employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');
const adminController = require('../controller/adminController');
const { addAdminValidation, addEmployeeValidation, updateTasksValidation, updateInventoryValidation} = require('../middleware/pipline/validateRequest');
const { validationHandler } = require('../middleware/Error');
const authEmployeeMiddleware = require('../middleware/EmployeeMiddleware/EmployeeMiddleware');
const authAdminMiddleware = require('../middleware/adminMiddleware/adminMiddleware');
// Define routes for employee registration and login
router.post('/register',authAdminMiddleware, addEmployeeValidation,validationHandler, employeeController.register);
router.get('/',authAdminMiddleware,validationHandler, employeeController.getAllEmployees);
router.post('/login',addAdminValidation,validationHandler, employeeController.login);
router.post('/task/complete',authEmployeeMiddleware,updateTasksValidation,validationHandler, employeeController.updateTask);
router.get("/task", authEmployeeMiddleware, employeeController.getTask);
router.put('/inventory/:itemId', authEmployeeMiddleware, updateInventoryValidation,validationHandler, employeeController.updateInventoryForEmployee);
router.get('/inventory', authEmployeeMiddleware, adminController.getAllInventory);
module.exports = router;
