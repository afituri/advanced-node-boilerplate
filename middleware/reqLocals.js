// attach models to request instance
module.exports = (app) => (req, res, next) => {
  req.models = app.locals.models;
  next();
};
