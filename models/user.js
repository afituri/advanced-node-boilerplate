const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const sendEmail = require('../aws');
// const { getEmailTemplate } = require('./EmailTemplate');
// const logger = require('../logs');

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
    emailVerificationToken: String,
    emailVerified: Boolean,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    phone: String,
    isAdmin: {
      type: Boolean,
      default: false
    },
    locale: {
      type: String,
      enum: ['en', 'ar'],
      default: 'ar'
    },
    picture: String,
    status: {
      type: String,
      enum: ['inactive', 'active'],
      default: 'inactive'
    }
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
mongoSchema.pre('save', async function save(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Helper method for validating user's password.
 */
mongoSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

mongoSchema.methods.getPublicFields = function getPublicFields() {
  return {
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
