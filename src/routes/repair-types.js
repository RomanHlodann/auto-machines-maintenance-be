const express = require('express');
const router = express.Router();

const RepairType = require('../models/RepairType');
const validateBody = require('../middlewares/validate-dto');
const verifyToken = require('../middlewares/verify-token');
const isObjectRelatedToUser = require('../middlewares/is-object-related-to-user');
const { createRepairTypeDTO, updateRepairTypeDTO } = require('../dto/repair-type');


router.get('/', verifyToken, async(req, res) => {
    try {
        const repairTypes = await RepairType.find({user: req.user._id});
        res.send(repairTypes);
    } catch (err) {
        console.log(err);
    }
})


router.get('/:id', verifyToken, isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        res.send(req.neededObject);
    } catch (err) {
        next(err);
    }
});


router.post('/', verifyToken, validateBody(createRepairTypeDTO), async (req, res, next) => {
    try {
        if (!req.body.notes) {
            req.body.notes = '';
        }

        const repairType = new RepairType({
            name: req.body.name,
            durationInDays: req.body.durationInDays,
            cost: req.body.cost,
            notes: req.body.notes,
            user: req.user._id
        });
    
        const newRepairType = await repairType.save();
        res.send(newRepairType);
    } catch (err) {
        next(err);
    }
});


router.patch('/:id', verifyToken, validateBody(updateRepairTypeDTO), isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        const updatedRepairType = await RepairType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedRepairType);
    } catch (err) {
        next(err);
    }
});


router.delete('/:id', verifyToken, isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        await RepairType.findByIdAndDelete(req.params.id);
        res.status(204).send('Repair Type was deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
