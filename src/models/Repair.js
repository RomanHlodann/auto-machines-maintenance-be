const mongoose = require('mongoose');


const RepairTypeSchema = new mongoose.Schema({
    machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    repairType: { type: mongoose.Schema.Types.ObjectId, ref: 'RepairType', required: true },
    beginDate: { type: Date, default: Date.now },
    notes: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


RepairTypeSchema.index({ name: 1, userId: 1 }, { unique: true });


module.exports = mongoose.model('RepairType', RepairTypeSchema);
