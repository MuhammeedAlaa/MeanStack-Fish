const mongoose = require('mongoose');
/**
 * module Models.day
 */

const daySchema = new mongoose.Schema({
  from: Date,
  to: Date,
  region: [
    {
      place: String,
      trans: String
    }
  ]
});
const Days = mongoose.model('Days', daySchema);

exports.Days = Days;
