const express = require('express');
const { mainErrorHandling } = require('../middleware/errorHandling')
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const auth = require('../routes/auth');
const users = require('../routes/users');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');

module.exports = function(app) {

    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);

    app.use(mainErrorHandling);
    
}