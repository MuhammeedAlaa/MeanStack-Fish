const _ = require('lodash');
const { Fish } = require('./../models/fishModel');
const { Order } = require('./../models/orderModel');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getFishes = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Fish.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const fishes = await api.query;
  res.status(200).json({
    fishes,
    user: req.user
  });
});
exports.getFishess = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Fish.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const fishes = await api.query;
  res.status(200).json({
    fishes
  });
});
exports.getFisheId = catchAsync(async (req, res, next) => {
  const fishes = await Fish.findById(req.params.id);
  res.status(200).json({
    fishes
  });
});
exports.deleteFish = catchAsync(async (req, res, next) => {
  await Fish.deleteOne({ _id: req.params.id });
  res.status(200).json({
    massages: 'deleted'
  });
});
exports.deleteAllFish = catchAsync(async (req, res, next) => {
  await Fish.deleteMany();
  await Order.deleteMany();
  res.status(200).json({
    massages: 'deleted'
  });
});
exports.addFish = catchAsync(async (req, res, next) => {
  const filteredBody = _.pick(req.body, ['price', 'type']);
  if (req.file) filteredBody.imgUrl = req.file.filename;
  const newFish = await Fish.create(filteredBody);
  res.status(200).json({
    newFish
  });
});
exports.updateFish = catchAsync(async (req, res, next) => {
  const filteredBody = _.pick(req.body, ['type', 'price']);
  const updatedFish = await Fish.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    fish: updatedFish
  });
});
