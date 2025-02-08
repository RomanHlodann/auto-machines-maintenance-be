const mongoose = require('mongoose');


const MachineSchema = new mongoose.Schema({
    country: { type: String, required: true },
    productionYear: { type: Number, required: true },
    brand: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

MachineSchema.index({ country: 1, productionYear: 1, brand: 1, userId: 1 }, { unique: true });


module.exports = mongoose.model('Machine', MachineSchema);
