const ApiRouter = require('./router-api-v1');
const { reqLocals } = require('../middleware');

module.exports = (app) => {
  app.use('/api/v1', reqLocals(app), ApiRouter);
};
