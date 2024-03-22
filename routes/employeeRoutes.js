// employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');
const { addAdminValidation, addEmployeeValidation } = require('../middleware/pipline/validateRequest');
const { validationHandler } = require('../middleware/Error');
const authEmployeeMiddleware = require('../middleware/EmployeeMiddleware/EmployeeMiddleware');
// Define routes for employee registration and login
router.post('/register',addEmployeeValidation,validationHandler, employeeController.register);
router.post('/login',addAdminValidation,validationHandler, employeeController.login);
router.get("/task", authEmployeeMiddleware, employeeController.getTask)

module.exports = router;
