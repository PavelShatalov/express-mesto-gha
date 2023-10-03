const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

const {
  NotFoundError,
} = require('../errors/index');

router.post('/signin', validation.createUser, login);
router.post('/signup', validation.login, createUser);
router.use(auth);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по 123 адресу ${req.path} не найден123123`));
});

module.exports = { router };
