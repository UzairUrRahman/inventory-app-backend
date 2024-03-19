// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Admin = require('../../Model/admin');

const authAdminMiddleware = async (req, res, next) => {
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
        // Find user in admin model
        const user = await Admin.findById(decoded.adminId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }
        req.user = user;
        next();
    } catch (error) {

        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authAdminMiddleware;
