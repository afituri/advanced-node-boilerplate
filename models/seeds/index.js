const mongoose = require('mongoose');

const { clean } = require('./clean');
const { seeds } = require('./seeds');
const logger = require('../../utils/logs');
const mongo = require('../../utils/mongo');

const startSeeding = async () => {
  await mongo();
  logger.info('Cleaning Database....');
  await clean();
  logger.info('Seeding....');
  await seeds();
  logger.info('Done....');
  await mongoose.connection.close();
};

startSeeding();
