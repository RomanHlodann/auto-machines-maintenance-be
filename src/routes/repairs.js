const express = require('express');
const router = express.Router();

const Repair = require('../models/Repair');
const Machine = require('../models/Machine');
const RepairType = require('../models/RepairType');
const validateBody = require('../middlewares/validate-dto');
const verifyToken = require('../middlewares/verify-token');
const isObjectRelatedToUser = require('../middlewares/is-object-related-to-user');
const { createRepairDTO, updateRepairDTO } = require('../dto/repair');

/**
 * @swagger
 * /api/repairs:
 *   get:
 *     summary: Get all repairs for the authenticated user
 *     description: Retrieves a list of repair associated with the logged-in user.
 *     tags:
 *       - Repair
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved repairs
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.get('/', verifyToken, async(req, res) => {
    try {
        const repairs = await Repair.find({user: req.user._id});
        res.send(repairs);
    } catch (err) {
        console.log(err);
    }
})

/**
 * @swagger
 * /api/repairs/{id}:
 *   get:
 *     summary: Get a specific repair by ID
 *     description: Retrieves details of a specific repair that belongs to the authenticated user.
 *     tags:
 *       - Repair
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved repair details
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, isObjectRelatedToUser(Repair), async (req, res, next) => {
    try {
        res.send(req.neededObject);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/repairs:
 *   post:
 *     summary: Create a new repair
 *     description: Creates a new repair record for the authenticated user.
 *     tags:
 *       - Repair
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machine:
 *                 type: string
 *                 example: "Washing Machine"
 *               repairType:
 *                 type: string
 *                 example: "Motor Replacement"
 *               beginDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-10"
 *               notes:
 *                 type: string
 *                 example: "Replace the motor, check wiring"
 *             required:
 *               - machine
 *               - repairType
 *               - beginDate
 *     responses:
 *       200:
 *         description: Successfully created a new repair
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.post('/', verifyToken, validateBody(createRepairDTO), async (req, res, next) => {
    try {
        if (!req.body.notes) {
            req.body.notes = '';
        }

        if (!await Machine.findById(req.body.machine) || !await RepairType.findById(req.body.repairType)) {
            return res.status(400).send('Invalid machine or repair type ID');
        }

        const repair = new Repair({
            machine: req.body.machine,
            repairType: req.body.repairType,
            beginDate: req.body.beginDate,
            notes: req.body.notes,
            user: req.user._id
        });
    
        const newRepair = await repair.save();
        res.send(newRepair);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/repairs/{id}:
 *   patch:
 *     summary: Update an existing repair
 *     description: Updates an existing repair record for the authenticated user.
 *     tags:
 *       - Repair
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair to update
 *         example: "609b1f49c01c6205d4ebfb9d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               machine:
 *                 type: string
 *                 example: "Refrigerator"
 *               repairType:
 *                 type: string
 *                 example: "Compressor Replacement"
 *               beginDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-15"
 *               notes:
 *                 type: string
 *                 example: "Check refrigerant levels"
 *     responses:
 *       200:
 *         description: Successfully updated the repair
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', verifyToken, validateBody(updateRepairDTO), isObjectRelatedToUser(Repair), async (req, res, next) => {
    try {
        if (req.body.machine && !await Machine.findById(req.body.machine)) {
            return res.status(400).send('Invalid machine ID');
        }
        if (req.body.repairType && !await RepairType.findById(req.body.repairType)) {
            return res.status(400).send('Invalid repair type ID');
        }

        const updatedRepair = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedRepair);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/repairs/{id}:
 *   delete:
 *     summary: Delete a specific repair
 *     description: Deletes a specific repair record that belongs to the authenticated user.
 *     tags:
 *       - Repair
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair to delete
 *         example: "609b1f49c01c6205d4ebfb9d"
 *     responses:
 *       204:
 *         description: Successfully deleted the repair
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', verifyToken, isObjectRelatedToUser(Repair), async (req, res, next) => {
    try {
        await Repair.findByIdAndDelete(req.params.id);
        res.status(204).send('Repair was deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
