const { promisify } = require('util');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { Admin, validate } = require('../models/adminModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createSendToken = (user, statusCode, res) => {
  const token = user.signToken();
  // Remove password from output
  user.password = undefined;
  user.__v = undefined;
  res.status(statusCode).json({
    token,
    user
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // validate with JOI as a first layer of validation
  await validate(
    _.pick(req.body, ['email', 'password', 'name', 'phone', 'passwordConfirm'])
  );
  const user = await Admin.findOne({ email: req.user.email }).select(
    '+password'
  );
  if (
    !user ||
    !(await user.correctPassword(req.body.userPassword, user.password))
  ) {
    return next(new AppError('Incorrect password', 401));
  }

  const newUser = await Admin.create({
    ..._.pick(req.body, [
      'email',
      'password',
      'name',
      'phone',
      'passwordConfirm'
    ]),
    imageUrl: `/images/users/default.png`
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Check if user exists && password is correct
  const user = await Admin.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Check if user still exists
  const currentUser = await Admin.findById(decoded.id);
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
