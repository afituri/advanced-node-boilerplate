const Handlebars = require('handlebars');
const logger = require('../utils/logs');

const send = require('./ses');
const templates = require('../config/templates.json');

exports.sendEmail = async (name, params) => {
  const source = templates[name];
  const message = Handlebars.compile(source.message)(params);
  const subject = Handlebars.compile(source.subject)(params);

  try {
    await send({
      from: source.from,
      to: [params.email],
      subject,
      body: message
    });
  } catch (err) {
    logger.error('Email sending error:', err);
  }
};
