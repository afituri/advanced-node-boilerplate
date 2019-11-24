const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    pin: { type: Number, required: true },
    expireAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 1200 // 20 minutes
    }
  },
  { timestamps: true }
);

const Verification = mongoose.model('Verification', mongoSchema);

module.exports = Verification;
