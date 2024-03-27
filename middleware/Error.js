// validationMiddleware.js
const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Format errors in a well-defined format
        const formattedErrors = errors.array().map(error => {
            return {
                field: error.param,
                message: error.msg
            };
        });
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

module.exports = { validationHandler };
