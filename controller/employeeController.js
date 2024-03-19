
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const employee = require('../Model/employee');

exports.register = async (req, res) => {
    const { email, password, category } = req.body;
    try {
        // Check if employee already exists
        const existingEmployee = await employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }
        // Create new employee
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployee = new employee({ email, password: hashedPassword, category });
        await newEmployee.save();
        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find employee by email
        const employeeUser = await employee.findOne({ email });
        if (!employeeUser) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Validate password
        const validPassword = await bcrypt.compare(password, employeeUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign(
            { employeeId: employeeUser._id, email: employeeUser.email },
            config.secret,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, user: employeeUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }

};
