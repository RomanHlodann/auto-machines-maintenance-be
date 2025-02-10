const express = require('express');
const router = express.Router();

const RepairType = require('../models/RepairType');
const validateBody = require('../middlewares/validate-dto');
const verifyToken = require('../middlewares/verify-token');
const isObjectRelatedToUser = require('../middlewares/is-object-related-to-user');
const { createRepairTypeDTO, updateRepairTypeDTO } = require('../dto/repair-type');

/**
 * @swagger
 * /api/repair-types:
 *   get:
 *     summary: Get all repair types for the authenticated user
 *     description: Retrieves a list of repair types associated with the logged-in user.
 *     tags:
 *       - Repair Types
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved repair types
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.get('/', verifyToken, async(req, res) => {
    try {
        const repairTypes = await RepairType.find({user: req.user._id});
        res.send(repairTypes);
    } catch (err) {
        console.log(err);
    }
})

/**
 * @swagger
 * /api/repair-types/{id}:
 *   get:
 *     summary: Get a specific repair-type by ID
 *     description: Retrieves details of a specific repair-types that belongs to the authenticated user.
 *     tags:
 *       - Repair Types
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair-type to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved repair-type details
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair type not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        res.send(req.neededObject);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/repair-types:
 *   post:
 *     summary: Create a new repair type
 *     description: Adds a new repair type for the authenticated user.
 *     tags:
 *       - Repair Types
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Engine Overhaul"
 *               durationInDays:
 *                 type: integer
 *                 example: 5
 *               cost:
 *                 type: number
 *                 example: 1500.50
 *               notes:
 *                 type: string
 *                 example: "Requires expert supervision"
 *     responses:
 *       201:
 *         description: Repair type successfully created
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/repair-types/{id}:
 *   patch:
 *     summary: Update an existing repair type
 *     description: Updates details of a repair type that belongs to the authenticated user.
 *     tags:
 *       - Repair Types
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Brake Repair"
 *               durationInDays:
 *                 type: integer
 *                 example: 2
 *               cost:
 *                 type: number
 *                 example: 500.00
 *               notes:
 *                 type: string
 *                 example: "Use genuine parts only"
 *     responses:
 *       200:
 *         description: Successfully updated repair type
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair type not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/:id', verifyToken, validateBody(updateRepairTypeDTO), isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        const updatedRepairType = await RepairType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedRepairType);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/repair-types/{id}:
 *   delete:
 *     summary: Delete a repair type
 *     description: Removes a repair type that belongs to the authenticated user.
 *     tags:
 *       - Repair Types
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the repair type to delete
 *     responses:
 *       204:
 *         description: Repair type successfully deleted
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Repair type not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', verifyToken, isObjectRelatedToUser(RepairType), async (req, res, next) => {
    try {
        await RepairType.findByIdAndDelete(req.params.id);
        res.status(204).send('Repair Type was deleted');
    } catch (err) {
        next(err);
    }
});


module.exports = router;
