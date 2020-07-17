const mongoose = require('mongoose');
/**
 * module Models.fish
 */

const fishSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'please enter the fish type'],
    minlength: 3,
    maxlength: 30
  },
  price: {
    type: String,
    required: [true, 'please enter the fish price']
  },

  imgUrl: {
    type: String,
    default: 'assets/fishes/default.jpg'
  },
  day: {
    type: mongoose.Schema.Types,
    ref: 'Day.from'
  }
});
const Fish = mongoose.model('Fishs', fishSchema);

exports.Fish = Fish;
