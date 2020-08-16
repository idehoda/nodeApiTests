const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
});


router.post('/', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
        return res.status(400).send('invalid credentials');
    }
    const correctPassword = await bcrypt.compare(req.body.password, existingUser.password);
    if (!correctPassword) {
        return res.status(400).send('invalid credentials');
    }
    const token = existingUser.generateJWT();
    return res.header('x-auth-token', token).json(existingUser);
});



module.exports = router;