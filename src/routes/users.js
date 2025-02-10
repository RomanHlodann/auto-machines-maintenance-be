const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const validateBody = require('../middlewares/validate-dto');
const { registerUserDTO, loginUserDTO } = require('../dto/user');

require('dotenv/config');


const router = express.Router();


router.post('/register', validateBody(registerUserDTO), async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
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
