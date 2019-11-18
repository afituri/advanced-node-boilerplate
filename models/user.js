/* eslint-disable func-names */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const mongoSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    phone: String,
    isActive: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      enum: ['EN', 'AR'],
      default: 'AR'
    },
    picture: String
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
mongoSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Match the user entered password with hashed password in db.
 */
mongoSchema.methods.validatePassword = async function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoSchema.methods.getPublicFields = function getPublicFields() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    locale: this.locale,
    isAdmin: this.isAdmin
  };
};

class UserClass {
  static publicFields() {
    return ['id', 'name', 'email', 'isAdmin', 'locale', 'picture'];
  }

  static search(query) {
    return this.find(
      {
        $or: [{ email: { $regex: query, $options: 'i' } }]
      },
      UserClass.publicFields().join(' ')
    );
  }

  static async list({ offset = 0, limit = 10 } = {}) {
    const users = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    return { users };
  }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model('User', mongoSchema);

module.exports = User;
