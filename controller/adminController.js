// adminController.js
const Admin = require('../Model/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Task = require('../Model/Task');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        // Create new admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        // Validate password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, email: admin.email },
            config.secret,
            { expiresIn: '1h' }
        );
        res.status(200).json({ user : admin,token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.createTask = async (req, res) => {
    try {
        // Create a new task instance with request data
        const newTask = new Task(req.body);
        // Save the task to the database
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.taskDetails = async (req, res) =>{
    const taskId = req.params.taskId;

    try {
        // Find task by ID in the database
        const task = await Task.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Return task details in the response
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Task not found' });
    }
}