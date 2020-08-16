const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { boolean } = require('joi');
require('dotenv').config();
const jwtSecret = process.env.JWT_KEY;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  isAdmin: { 
    type: Boolean,
    default: false
  }
})
userSchema.methods.generateJWT = function() {
  const token = jwt.sign({ 
    _id: this._id,
    isAdmin: this.isAdmin,
    name: this.name,
    email: this.email,
  }, jwtSecret);
  return token;
}
const User = mongoose.model('User', userSchema)

const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});

exports.schema = schema;
exports.User = User; 