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
  res.status(200).json({
    admins,
    id: req.user._id
  });
});
