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
    default: 'images/users/default.png'
  }
});
const Fish = mongoose.model('Fishs', fishSchema);

exports.Fish = Fish;
