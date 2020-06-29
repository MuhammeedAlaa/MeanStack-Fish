const _ = require('lodash');
const { Order } = require('./../models/orderModel');
const { Fish } = require('./../models/fishModel');
const catchAsync = require('./../utils/catchAsync');

exports.createAddress = catchAsync(async (req, res, next) => {
  let order = await Order.findOne({
    ..._.pick(req.body, [
      'floor',
      'name',
      'phone',
      'buildingNumber',
      'region',
      'appartmentNumber'
    ])
  });
  if (!order) {
    order = new Order({
      ..._.pick(req.body, [
        'floor',
        'name',
        'phone',
        'buildingNumber',
        'region',
        'appartmentNumber'
      ])
    });
    await order.save({ validateBeforeSave: false });
  }
  return res.status(200).json({ order });
});
exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    ..._.pick(req.body, [
      'floor',
      'name',
      'phone',
      'buildingNumber',
      'region',
      'appartmentNumber'
    ])
  });
  order.totalPrice = req.body.totalPrice;
  order.Fishes = req.body.Fishes;
  await order.save({ validateBeforeSave: false });
  return res.status(201).json({
    order
  });
});
exports.updateAddress = catchAsync(async (req, res, next) => {
  const user = await Order.findById(req.body._id);
  user.floor = req.body.floor;
  user.name = req.body.name;
  user.phone = req.body.phone;
  user.buildingNumber = req.body.buildingNumber;
  user.region = req.body.region;
  user.appartmentNumber = req.body.appartmentNumber;
  await user.save({ validateBeforeSave: false });
  return res.status(201).json({
    user
  });
});
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const user = await Order.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    user
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  let page = [];
  let number = 1;
  orders.forEach(order => {
    for (let i = 0; i < order.Fishes.length; i++) {
      const info = {
        name: order.name,
        phone: order.phone,
        floor: order.floor,
        region: order.region,
        buildingNumber: order.buildingNumber,
        appartmentNumber: order.appartmentNumber,
        id: order._id,
        number: number,
        amount: order.Fishes[i].amount,
        fishId: order.Fishes[i].Fish
      };
      page.push(info);
    }
    number++;
  });

  for (let order_index = 0; order_index < page.length; order_index++) {
    const element = page[order_index].fishId;
    const fish = await Fish.findById(element);
    page[order_index].price = fish.price;
    page[order_index].type = fish.type;
  }
  return res.status(200).json({
    page
  });
});
