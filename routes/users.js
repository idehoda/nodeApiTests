const { User, schema } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { hashPassword } = require('../service/hash');
const { isAuthenticated } = require('../middleware/auth');

router.get('/me', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user);
})

router.post('/register', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).send(' existingUser error');
    }
    const { hashedPass, salt } = await hashPassword(req.body.password);
    let user = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: hashedPass
    });
    const savedUser = await user.save();
    const token = savedUser.generateJWT()
    return res.header('x-auth-token', token).json(savedUser)
});

module.exports = router;