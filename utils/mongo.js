const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/mongoose.json')[env];

module.exports = () => {
  // Set the production MongoDB URL if
  // we're using the production config
  const envUrl = process.env[config.use_env_variable];

  // Define a local URL variable if we're
  // not in production
  const localUrl = `mongodb://${config.host}/${config.database}`;

  // Set the connection URL
  const mongoUrl = envUrl || localUrl;

  return mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
};
