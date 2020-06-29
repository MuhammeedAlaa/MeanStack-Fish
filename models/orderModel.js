const mongoose = require('mongoose');
/**
 * @module Models.order
 */

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter your name'],
    minlength: 3,
    maxlength: 30
  },
  floor: {
    type: String,
    required: [true, 'please enter the fish type'],
    minlength: 3,
    maxlength: 30
  },
  totalPrice: {
    type: String,
    required: [true, 'please enter the fish totale price']
  },
  phone: {
    type: String,
    required: [true, 'please enter the phone '],
    length: 14
  },
  buildingNumber: {
    type: String,
    required: [true, 'please enter the buildingNumber'],
    minlength: 1,
    maxlength: 10
  },
  region: {
    type: String,
    required: [true, 'please enter the region'],
    minlength: 1,
    maxlength: 30
  },
  appartmentNumber: {
    type: String,
    required: [true, 'please enter the region'],
    minlength: 1,
    maxlength: 30
  },
  Fishes: [
    {
      Fish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fish'
      },
      amount: String
    }
  ]
});
const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;
