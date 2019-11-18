const mongoose = require('mongoose');
const logger = require('../../utils/logs');

exports.clean = async () => {
  try {
    await Promise.all(
      Object.keys(mongoose.connection.collections).map(async key => {
        await mongoose.connection.collections[key].deleteMany({});
      })
    );
  } catch (err) {
    logger.error(err);
  }
};
