const mongoose = require('mongoose');
const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * @module Models.admin
 */

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
    minlength: [3, 'your name minmun length is 3'],
    maxlength: [30, 'your name maxmun length is 30']
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    minlength: [5, 'your email minmun length is 5'],
    maxlength: [255, 'your email minmun length is 255'],
    unique: [true, 'this email in used by onther user'],
    lowercase: [true, 'your email must be lowercsae'],
    validate: [validator.isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
    minlength: [8, 'your password minmun length is 8'],
    maxlength: [1024, 'your password minmun length is 1024'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please enter your password confirm'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'the password and password confirmation must be the same'
    }
  },
  imageUrl: String,
  phone: String,
  registraionToken: String
});

adminSchema.pre('save', async function (next) {
  // if password was not modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  this.emailConfirm = undefined;
  next();
});
adminSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // to make sure the token is created after the password has been modified
  // because saving to the database is a bit slower than making the token
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * this function is to compare a provided password with the stored one
 * function correctPassword
 * param {string} candidatePassword - the provided password to be checked
 * param {string} userPassword - the hashed password of the user from the database
 * returns {boolean} - true if the password matches the one in the database
 */

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * to make a JWT token for the user using the is as payload
 * function signToken
 * returns {string} - a json web token to identify the user and to be used in bearer token authorization
 */

adminSchema.methods.signToken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_VALID_FOR
    }
  );
};

const Admin = mongoose.model('Admins', adminSchema);

async function validateUser (user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(30)
      .required(),
    phone: Joi.string(),
    passwordConfirm: Joi.ref('password')
  });
  try {
    return await schema.validateAsync(user);
  } catch (err) {
    throw err;
  }
}

exports.Admin = Admin;
exports.validate = validateUser;
