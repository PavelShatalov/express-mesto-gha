const routes = require('express').Router();
const {
  NotFoundError,
} = require('../errors/index');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
});

module.exports = { routes };
