
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const employee = require('../Model/employee');
const Task = require('../Model/Task');
const Inventory = require('../Model/Inventory');

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

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await employee.find();
        res.json(employees);
    } catch (error) {
        console.error(error);
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


exports.getTask = async (req, res)=> {
    console.log("user", req.user);
    const {role, category} = req.user;
    try {
        if (role !== 'employee') {
            return res.status(403).json({ message: 'Forbidden. Only employees can access this route' });
        }
        console.log("role");
        const getTask = await Task.find({
            status : 'incomplete',
            assignRole : category
        });
        // Fetch tasks for employees
        // const tasks = await Task.aggregate([
        //     // Match tasks with status pending or incomplete
        //     {
        //         $match: {
        //             assignRole: category,
        //             status: { $in: ['incomplete'] }
        //         }
        //     },
        //     // Project to filter only tasks where at least one sub-task is not completed
        //     {
        //         $project: {
        //             tasks: {
        //                 $filter: {
        //                     input: '$tasks',
        //                     as: 'task',
        //                     cond: { $eq: ['$$task.completed', false] }
        //                 }
        //             },
        //         }
        //     },
        //     {
        //         $match: {
        //             'tasks.0': { $exists: true } // Check if the first element of tasks array exists
        //         }
        //     }
        // ]);
              
        // console.log("tasks", tasks);
        res.json(getTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updateTask = async(req, res, next) => {
    try {
        const { tasks } = req.body;
        console.log({tasks : req.body});
        for (const taskObj of req.body) {
            const { checklistId, complete, taskId } = taskObj;
            // Update sub-task completion status
            await Task.findOneAndUpdate(
                { 
                    _id: checklistId, // Match the main task _id
                    'tasks._id': taskId // Match the sub-task _id
                },
                { $set: { 'tasks.$.completed': complete } }
            );
            // Fetch the main task from the database
            const mainTask = await Task.findById(checklistId);

            // Check if all sub-tasks are completed
            const allCompleted = mainTask.tasks.every(subTask => subTask.completed);
                console.log("allCompleted", allCompleted);
            // Update main task status based on sub-tasks completion
            await Task.findByIdAndUpdate(
                checklistId,
                { $set: { status: allCompleted ? 'completed' : 'incomplete' } }
            );
        }

        res.status(200).json({ message: 'Tasks updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



exports.updateInventoryForEmployee = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { remaining, par } = req.body;

        let inventory = await Inventory.findById(itemId);

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        if (remaining !== undefined) {
            if (par !== undefined && remaining > par) {
                return res.status(400).json({ message: 'Remaining must be less than or equal to Par' });
            }
            inventory.remaining = remaining;
        } else {
            return res.status(400).json({ message: 'Remaining field is required' });
        }

        // Save the updated inventory item
        await inventory.save();

        res.json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
