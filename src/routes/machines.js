const express = require('express');
const router = express.Router();

const Machine = require('../models/Machine');
const validateBody = require('../middlewares/validate-dto');
const verifyToken = require('../middlewares/verify-token');
const isObjectRelatedToUser = require('../middlewares/is-object-related-to-user');
const { createMachineDTO, updateMachineDTO } = require('../dto/machine');

/**
 * @swagger
 * /api/machines:
 *   get:
 *     summary: Get all machines for the authenticated user
 *     description: Retrieves a list of machines associated with the logged-in user.
 *     tags:
 *       - Machines
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved machines
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.get('/', verifyToken, async(req, res) => {
    try {
        const machines = await Machine.find({user: req.user._id});
        res.send(machines);
    } catch (err) {
        console.log(err);
    }
})


/**
 * @swagger
 * /api/machines/{id}:
 *   get:
 *     summary: Get a specific machine by ID
 *     description: Retrieves details of a specific machine that belongs to the authenticated user.
 *     tags:
 *       - Machines
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the machine to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved machine details
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        res.send(req.neededObject);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/machines:
 *   post:
 *     summary: Create a new machine
 *     description: Adds a new machine for the authenticated user.
 *     tags:
 *       - Machines
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: "Germany"
 *               productionYear:
 *                 type: integer
 *                 example: 2022
 *               brand:
 *                 type: string
 *                 example: "Caterpillar"
 *     responses:
 *       201:
 *         description: Machine successfully created
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/machines/{id}:
 *   patch:
 *     summary: Update an existing machine
 *     description: Updates details of a machine that belongs to the authenticated user.
 *     tags:
 *       - Machines
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the machine to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: "USA"
 *               productionYear:
 *                 type: integer
 *                 example: 2023
 *               brand:
 *                 type: string
 *                 example: "Komatsu"
 *     responses:
 *       200:
 *         description: Successfully updated machine
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', verifyToken, validateBody(updateMachineDTO), isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedMachine);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/machines/{id}:
 *   delete:
 *     summary: Delete a machine
 *     description: Removes a machine that belongs to the authenticated user.
 *     tags:
 *       - Machines
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the machine to delete
 *     responses:
 *       204:
 *         description: Machine successfully deleted
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       403:
 *         description: Forbidden (Machine does not belong to the user)
 *       404:
 *         description: Machine not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', verifyToken, isObjectRelatedToUser(Machine), async (req, res, next) => {
    try {
        await Machine.findByIdAndDelete(req.params.id);
        res.status(204).send('Machine deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
