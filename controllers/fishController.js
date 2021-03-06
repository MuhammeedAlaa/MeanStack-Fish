const _ = require('lodash');
const { Fish } = require('./../models/fishModel');
const { Order } = require('./../models/orderModel');
const { Notification } = require('./../models/notificationsModel');
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
  await Notification.deleteMany();
  res.status(200).json({
    massages: 'deleted'
  });
});
exports.addFish = catchAsync(async (req, res, next) => {
  const file = req.file;
  req.body = JSON.parse(req.body.fish);

  const filteredBody = _.pick(req.body, ['price', 'type', 'day']);
  if (req.file) filteredBody.imgUrl = '/assets/' + file.filename;
  const newFish = await Fish.create(filteredBody);
  res.status(200).json({
    newFish
  });
});
exports.updateFish = catchAsync(async (req, res, next) => {
  const file = req.file;
  req.body = JSON.parse(req.body.fish);

  const filteredBody = _.pick(req.body, ['type', 'price', 'day']);
  if (req.file) filteredBody.imgUrl = '/assets/' + file.filename;

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
exports.getAmounts = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  const fishes = await Fish.find();
  const map = new Map();
  fishes.forEach(fish => {
    const obj = {
      id: fish._id,
      day: fish.day
    };
    map.set(obj, fish.type);
  });
  let page = [];
  orders.forEach(order => {
    order.Fishes.forEach(fish => {
      const obj = {
        id: fish.Fish,
        day: order.day,
        amount: fish.amount
      };
      page.push(obj);
    });
  });
  let result = [];
  map.forEach((value, key) => {
    key.day = key.day.toString();
    key.id = key.id.toString();
    const obj = {
      day: key.day,
      type: value,
      amount: 0
    };
    let amount = 0;
    page.forEach(obj => {
      const d = obj.id.toString();
      const id = obj.day.toString();
      if (key.id == d && key.day == id) {
        console.log(obj.amount);
        amount += parseFloat(obj.amount);
      }
    });
    obj.amount = amount;
    result.push(obj);
  });
  console.log(result);
  res.status(200).json({
    result
  });
});
