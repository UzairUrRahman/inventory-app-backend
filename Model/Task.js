const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: { type: String, required: true },
    assignRole: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'incomplete'], default: 'pending' },
    tasks: [
        {
            title: { type: String, required: true },
            completed: { type: Boolean, default: false }
        }
    ],
},{
    timestamps: true
});

taskSchema.virtual('numberOfTasks').get(function() {
    return this.tasks.length;
});

taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
