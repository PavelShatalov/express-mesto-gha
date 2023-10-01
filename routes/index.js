const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth');
const validation = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

const {
  NotFoundError,
} = require('../errors/index');

router.use('*', (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
});
router.post('/signin', validation.login, login);
router.post('/signup', validation.login, createUser);
router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use(auth);
module.exports = { router };
