const {Genre, schema} = require('../models/genre');
const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const mongoose  = require('mongoose');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', isAuthenticated, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message)
  };
  let genre = new Genre({ 
    name: req.body.name, 
    creator: req.body.creator || 'test'
  });
  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', async (req, res) => {
  const { error } = schema.validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id', [isAuthenticated, isAdmin], async (req, res) => {
  const { error } = schema.validate({name: req.params.name}); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;