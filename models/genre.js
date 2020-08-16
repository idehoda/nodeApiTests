const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  creator: {
    type: String,
  }
});

const Genre = mongoose.model('Genre', genreSchema);


const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  creator: Joi.string().min(3)
});

exports.schema = schema;
exports.genreSchema = genreSchema;
exports.Genre = Genre; 