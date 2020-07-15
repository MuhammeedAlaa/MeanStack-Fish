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
const Day = mongoose.model('Days', daySchema);

exports.Day = Day;
