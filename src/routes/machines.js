const express = require('express');
const router = express.Router();

const Machine = require('../models/Machine');
const validateBody = require('../middlewares/validate-dto');
const { createMachineDTO, updateMachineDTO } = require('../dto/machine');


router.get('/', async(req, res) => {
    const machines = await Machine.find({});
    res.send(machines);
})


router.get('/:id', async (req, res, next) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            return res.status(404).send({'message': 'Machine not found'});
        }
        res.send(machine);
    } catch (err) {
        next(err);
    }
});


router.post('/', validateBody(createMachineDTO), async (req, res, next) => {
    try {
        const machine = new Machine({
            country: req.body.country,
            productionYear: req.body.productionYear,
            brand: req.body.brand
        });
    
        const newMachine = await machine.save();
        res.send(newMachine);
    } catch (err) {
        next(err);
    }
});


router.patch('/:id', validateBody(updateMachineDTO), async (req, res, next) => {
    try {
        const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(machine);
    } catch (err) {
        next(err);
    }
});


router.delete('/:id', async (req, res, next) => {
    try {
        await Machine.findByIdAndDelete(req.params.id);
        res.status(204).send('Machine deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
