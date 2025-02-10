const express = require('express');
const router = express.Router();

const Machine = require('../models/Machine');
const validateBody = require('../middlewares/validate-dto');
const verifyToken = require('../middlewares/verify-token');
const isObjectRelatedToUser = require('../middlewares/is-object-related-to-user');
const { createMachineDTO, updateMachineDTO } = require('../dto/machine');


router.get('/', verifyToken, async(req, res) => {
    try {
        const machines = await Machine.find({user: req.user._id});
        res.send(machines);
    } catch (err) {
        console.log(err);
    }
})


router.get('/:id', verifyToken, isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        res.send(req.neededObject);
    } catch (err) {
        next(err);
    }
});


router.post('/', verifyToken, validateBody(createMachineDTO), async (req, res, next) => {
    try {
        const machine = new Machine({
            country: req.body.country,
            productionYear: req.body.productionYear,
            brand: req.body.brand,
            user: req.user._id
        });
    
        const newMachine = await machine.save();
        res.send(newMachine);
    } catch (err) {
        next(err);
    }
});


router.patch('/:id', verifyToken, validateBody(updateMachineDTO), isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedMachine);
    } catch (err) {
        next(err);
    }
});


router.delete('/:id', verifyToken, isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        await Machine.findByIdAndDelete(req.params.id);
        res.status(204).send('Machine deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
