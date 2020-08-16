require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const app = require('express')();
require('dotenv').config();
require('./routes')(app)
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
},() => {})

const server = app.listen(port, () => {});

module.exports = server;
