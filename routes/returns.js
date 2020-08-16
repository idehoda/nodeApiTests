const { Rental, schema } = require('../models/rental');
const { Movie } = require('../models/movie');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { validateInput } = require('../middleware/validateInput');
const router = express.Router();

router.post('/', [isAuthenticated, validateInput(schema)], async (req, res, next) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.lookup(customerId, movieId);
  if (!rental) {
    return res.status(404).send('no rental found')
  }
  if (rental.dateReturned) {
    return res.status(400).send('Already processed')
  }
  rental.updateData()
  await rental.save();
  const updated = await Movie.update({ _id: rental.movie._id}, {
    $inc: { numberInStock: 1}
  })
  res.status(200).send(rental);
});

module.exports = router;