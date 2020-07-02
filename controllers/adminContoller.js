const _ = require('lodash');
const { Admin } = require('./../models/adminModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

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
  const filteredBody = _.pick(req.body, ['email', 'name', 'phone']);
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
