// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Employee = require('../../Model/employee');

const authEmployeeMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("authHeader", authHeader)
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, config.secret);
        console.log("decoded", decoded);
        // Find user in employee model
        const user = await Employee.findById(decoded.employeeId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }
        req.user = user;
        next();
    } catch (error) {

        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authEmployeeMiddleware;
