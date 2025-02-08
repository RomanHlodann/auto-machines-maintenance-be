const mongoose = require('mongoose');


const RepairTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    durationInDays: { type: Number, required: true, min: 1 },
    cost: { type: mongoose.Decimal128, min: 0 },
    notes: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


RepairTypeSchema.index({ name: 1, userId: 1 }, { unique: true });


module.exports = mongoose.model('RepairType', RepairTypeSchema);
