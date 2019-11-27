/* eslint-disable */
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('../config');
const { User } = require('../models');
const logger = require('../utils/logs');

class JWTAuth {
  createToken(user) {
    try {
      user = user.toObject();
      delete user.password;
      const token = jwt.sign(user, jwtSecret, {
        expiresIn: '1h'
      });
      return { user, token: `Bearer ${token}` };
    } catch (err) {
      logger.error(err);
    }
  }

  attachTo(app) {
    passport.use(
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: jwtSecret
        },
        async (jwtPayload, done) => {
          await User.findById(jwtPayload._id).then(user => {
            return done(null, user);
          });
        }
      )
    );
    app.use(passport.initialize());
    return app;
  }
}

module.exports = new JWTAuth();
