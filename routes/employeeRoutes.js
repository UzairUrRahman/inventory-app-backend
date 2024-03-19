// employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');
const { addAdminValidation, addEmployeeValidation } = require('../middleware/pipline/validateRequest');
const { validationHandler } = require('../middleware/Error');
// Define routes for employee registration and login
router.post('/register',addEmployeeValidation,validationHandler, employeeController.register);
router.post('/login',addAdminValidation,validationHandler, employeeController.login);

module.exports = router;
