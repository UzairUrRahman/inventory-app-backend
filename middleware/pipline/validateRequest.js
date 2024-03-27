const { check, body, param } = require('express-validator');
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
const createInventoryValidation = [
    body('itemName').notEmpty().withMessage('Item name is required'),
    body('par').isInt({ min: 1 }).withMessage('Par should be a positive integer'),
    body('remaining').isInt({ min: 0 }).withMessage('Remaining should be a positive integer'),
];

const updateInventoryValidation = [
    param('itemId').notEmpty().withMessage('Item ID is required'),
    body('par').optional().isInt({ min: 0 }).withMessage('Par should be a positive integer'),
    body('remaining').optional().isInt({ min: 0 }).withMessage('Remaining should be a positive integer'),
];


// update task
const updateTasksValidation = [
    body().isArray().withMessage('Tasks should be an array'),
    body('*.checklistId').notEmpty().withMessage('Checklist ID is required'),
    body('*.complete').isBoolean().withMessage('Complete status should be a boolean'),
    body('*.taskId').notEmpty().withMessage('Task ID is required'),
];


module.exports = {
    addAdminValidation,
    addEmployeeValidation,
    createTaskValidation,
    createInventoryValidation,
    updateInventoryValidation,
    updateTasksValidation
}