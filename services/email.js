const asyncHandler = require('express-async-handler');
const Handlebars = require('handlebars');

const send = require('./ses');
const templates = require('../config/templates.json');

const env = process.env.NODE_ENV;

exports.sendEmail = asyncHandler(async (name, params) => {
  const source = templates[name];
  const message = Handlebars.compile(source.message)(params);
  const subject = Handlebars.compile(source.subject)(params);
  if (env !== 'test') {
    await send({
      from: source.from,
      to: [params.email],
      subject,
      body: message
    });
  }
});
