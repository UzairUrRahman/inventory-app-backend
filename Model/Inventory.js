const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    itemName: { type: String, required: true },
    par: { type: Number, required: true },
    remaining: { type: Number, required: true },
    order: { 
        type: Number
    }
});

// Middleware to update order field before saving
inventorySchema.pre('save', function(next) {
    this.order = Math.max(0, this.par - this.remaining);
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
