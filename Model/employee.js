// employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'employee', immutable: true }, 
    category: { type: String, enum: ['bartender', 'cook'] }
});

module.exports = mongoose.model('Employee', employeeSchema);
