const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  pin: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expireAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 60
  }
});

const Verification = mongoose.model('Verification', mongoSchema);

module.exports = Verification;
