const _ = require('lodash');
const { Admin } = require('./../models/adminModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const { Notification } = require('../models/notificationsModel');
const { Days } = require('./../models/dayModel');
const { Fish } = require('./../models/fishModel');
const { Order } = require('./../models/orderModel');
const AppError = require('./../utils/appError');

exports.admin = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Admin.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const admins = await api.query;
  res.status(200).json(admins);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const file = req.file;
  req.body = JSON.parse(req.body.user);

  const filteredBody = _.pick(req.body, ['email', 'name', 'phone']);
  filteredBody.imageUrl = `/assets/${file.filename}`;
  // 3) Update user document
  const updatedUser = await Admin.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json(updatedUser);
});
exports.setRegistrationToken = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.user._id);
  admin.registraionToken = req.body.regToken;
  await admin.save({ validateBeforeSave: false });
  res.status(200).json({ admin });
});

exports.getNotificationsHistory = catchAsync(async (req, res, next) => {
  const user = await Admin.findById(req.user._id).select('+notification');
  if (user.notification === undefined) {
    console.log(user);

    return next(
      new AppError("this user doesn't have notifications history", 404)
    );
  }
  const notifications = await Notification.findById(user.notification);
  res.status(200).json({ notifications });
});

exports.insertDay = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const day = await Days.create({
    ..._.pick(req.body, ['from', 'to', 'region'])
  });
  return res.status(201).json({
    day
  });
});
exports.editDay = catchAsync(async (req, res, next) => {
  const filteredBody = _.pick(req.body, ['from', 'to', 'region']);
  const updatedDay = await Days.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    day: updatedDay
  });
});
exports.deleteAllDays = catchAsync(async (req, res, next) => {
  await Fish.deleteMany();
  await Order.deleteMany();
  await Days.deleteMany();
  await Notification.deleteMany();
  res.status(200).json({
    massages: 'deleted'
  });
});

exports.deleteDay = catchAsync(async (req, res, next) => {
  const day = await Days.findByIdAndDelete(req.params.id);
  await Fish.deleteMany({ day: day.from });
  await Order.deleteMany({ day: day.from });
  await Notification.deleteMany({ day: day.from });
  res.status(200).json({
    massages: 'deleted'
  });
});
