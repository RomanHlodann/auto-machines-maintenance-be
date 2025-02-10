const mongoose = require('mongoose');


const RepairSchema = new mongoose.Schema({
    machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    repairType: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairType', required: true },
    beginDate: { type: Date, default: Date.now },
    notes: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


// RepairSchema.index({ machine: 1, repairType: 1, beginDate: 1, notes: 1, userId: 1 }, { unique: true });


module.exports = mongoose.model('Repair', RepairSchema);
