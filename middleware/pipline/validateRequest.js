const { check, body } = require('express-validator');
const addAdminValidation = [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const addEmployeeValidation = [
    check('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    check('category').isIn(['bartender', 'cook']).withMessage('Invalid category')
];


// New Task validate
const createTaskValidation = [
    body('taskName').notEmpty().withMessage('Task name is required'),
    body('assignRole').notEmpty().withMessage('Assign role is required'),
    body('tasks').isArray({ min: 1 }).withMessage('Tasks should be a none Empty '),
    body('tasks.*.title').notEmpty().withMessage('Task title is required'),
];
module.exports = {
    addAdminValidation,
    addEmployeeValidation,
    createTaskValidation
}