const faker = require('faker');
const logger = require('../../utils/logs');
const models = require('../../models');

exports.seeds = async () => {
  const { User } = models;

  // ----------------------------------------
  // Create Users
  // ----------------------------------------
  const users = [];

  for (let i = 0; i < 5; i += 1) {
    users.push(
      new User({
        pseudonym: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    );
  }

  try {
    await User.create(users);
  } catch (err) {
    logger.error('Something went wrong');
  }
};
