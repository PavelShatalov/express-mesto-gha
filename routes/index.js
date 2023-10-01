const express = require('express');

const router = express.Router();
const {
  NotFoundError,
} = require('../errors/index');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
});

module.exports = { router };
