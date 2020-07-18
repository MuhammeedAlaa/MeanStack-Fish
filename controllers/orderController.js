const _ = require('lodash');
const { Order } = require('./../models/orderModel');
const { Fish } = require('./../models/fishModel');
const { Admin } = require('./../models/adminModel');
const { Days } = require('./../models/dayModel');
const catchAsync = require('./../utils/catchAsync');
const { notify } = require('./../startup/notifications');
const APIFeatures = require('./../utils/apiFeatures');

exports.createAddress = catchAsync(async (req, res, next) => {
  let order = await Order.findOne({
    ..._.pick(req.body, [
      'floor',
      'name',
      'phone',
      'buildingNumber',
      'region',
      'appartmentNumber',
      'day',
      'transports'
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
        'appartmentNumber',
        'day',
        'transports'
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
  order.transports = req.body.transports;
  order.Fishes = req.body.Fishes;
  const orders = await Order.find();
  let number = 1;
  orders.forEach(o => {
    if (o.Fishes.length != 0) number++;
  });
  order.number = number;
  await order.save({ validateBeforeSave: false });
  const admins = await Admin.find();
  const ids = [];
  let index = 0;
  admins.forEach(admin => {
    ids[index] = admin._id;
    index++;
  });

  await notify(
    ids,
    order._id,
    order.day,
    'New Order',
    `${order.name} made or edit his order`,
    'assets/Notify.png'
  );

  return res.status(201).json({
    order
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.body._id);
  order.floor = req.body.floor;
  order.name = req.body.name;
  order.phone = req.body.phone;
  order.buildingNumber = req.body.buildingNumber;
  order.region = req.body.region;
  order.appartmentNumber = req.body.appartmentNumber;
  await order.save({ validateBeforeSave: false });
  const admins = await Admin.find();
  const ids = [];
  let index = 0;
  admins.forEach(admin => {
    ids[index] = admin._id;
    index++;
  });

  await notify(
    ids,
    order._id,
    order.day,
    'Edit Address',
    `${order.name} has changed this address`,
    'assets/ChangeAdreess.png'
  );

  return res.status(201).json({
    order
  });
});
exports.sentOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.body._id);
  order.sent = true;
  order.sender = req.user.name;
  await order.save({ validateBeforeSave: false });
  return res.status(201).json({
    order
  });
});
exports.deleteOrder = catchAsync(async (req, res, next) => {
  const user = await Order.findByIdAndDelete(req.params.id);
  const admins = await Admin.find();
  const ids = [];
  let index = 0;
  admins.forEach(admin => {
    ids[index] = admin._id;
    index++;
  });

  await notify(
    ids,
    user.day,
    user._id,
    'Delete Order',
    `${user.name} has deleted this order`,
    'assets/DeleteOrder.png'
  );

  return res.status(200).json({
    user
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Order.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const orders = await api.query;

  let page = [];
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
        number: order.number,
        sender: order.sender,
        sent: order.sent,
        transports: order.transports,
        amount: order.Fishes[i].amount,
        fishId: order.Fishes[i].Fish,
        day: order.day
      };
      page.push(info);
    }
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
exports.getDays = catchAsync(async (req, res, next) => {
  const api = new APIFeatures(Days.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .sort();
  const days = await api.query;

  return res.status(200).json({
    days
  });
});
