// adminController.js
const Admin = require('../Model/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Task = require('../Model/Task');
const Inventory = require('../Model/Inventory');

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
    console.log("Details")
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

exports.allTask = async (req, res) => {
    try {
        console.log("coming!");
        let tasks;
        const { status } = req.query;

        // If status query parameter is provided, validate it
        if (status) {
            if (!['pending', 'incomplete', 'completed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status. Status should be "pending", "incomplete", or "completed"' });
            }
            // Fetch tasks with the specified status
            tasks = await Task.find({ status });
        } else {
            // Fetch all tasks if no status is provided
            tasks = await Task.find();
        }
        console.log("task", tasks);
        res.status(201).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.createInventory = async (req, res, next) =>{
    try {
        const { itemName, par, remaining } = req.body;
        // Create new inventory item
        const inventory = new Inventory({
            itemName,
            par,
            remaining
        });

        // Save the inventory item to the database
        await inventory.save();

        res.status(201).json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.getAllInventory = async (req, res) => {
    try {
        // Fetch all inventory items from the database
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.fetchInventory = async () => {
    try {
        // Fetch all inventory items from the database
        const inventory = await Inventory.find();
        return inventory;
    } catch (error) {
       throw new Error(error.message);   
     }
}



exports.updateInventory = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { par, remaining } = req.body;


        let inventory = await Inventory.findById(itemId);

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        if (par !== undefined) {
            inventory.par = par;
        }

        if (remaining !== undefined) {
            inventory.remaining = remaining;
        }

        // Save the updated inventory item
        await inventory.save();

        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

