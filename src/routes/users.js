const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const validateBody = require('../middlewares/validate-dto');
const { registerUserDTO, loginUserDTO } = require('../dto/user');

require('dotenv/config');


const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by providing a name, email, and password. The email must be unique.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user (must be unique)
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: "securePassword123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Successfully registered the user
 *       400:
 *         description: Email already exists or invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', validateBody(registerUserDTO), async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user by verifying their email and password. If valid, returns a JWT token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "securePassword123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in and returned a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token used for authenticated requests
 *                   example: "your-jwt-token-here"
 *       401:
 *         description: Invalid credentials (email or password mismatch)
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', validateBody(loginUserDTO), async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.SECRET_KEY);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});


module.exports = router;
