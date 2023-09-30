const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // импортируем модель
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/index');

// const BAD_REQUEST = http.STATUS_CODES[400];
// const NOT_FOUND = http.STATUS_CODES[404];
// const INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];
const OK = http.STATUS_CODES[200];
// const UNAUTHORIZED = http.STATUS_CODES[401];

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
module.exports.getUserId = (req, res, next) => {
  // Если пользователь существует, ищем его по ID
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.status(OK).json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Некорректный ID пользователя.');
      }
      throw err;
    }).catch(next);
};

module.exports.CreateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Произошла ошибка при создании пользователя.');
      }
      if (err.code === 11000) { throw new ConflictError('Пользователь с таким email уже существует.'); }
      throw err;
    }).catch(next);
};

module.exports.CreateUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  // Хешируем пароль перед сохранением в базу данных
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        email, password: hashedPassword, name, about, avatar,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError('Произошла ошибка при создании пользователя.');
          }
          throw err;
        }).catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Найдем пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // Проверим пароль пользователя
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          // Если пароль правильный, создадим JWT
          const token = jwt.sign(
            { _id: user._id },
            'your-secret-key', // Замените на ваш секретный ключ для подписи токена
            { expiresIn: '7d' }, // Токен будет действителен в течение недели
          );
          // Отправим JWT клиенту в httpOnly куку
          res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Время жизни куки в миллисекундах (неделя)
            httpOnly: true,
            sameSite: 'none', // Настройте в зависимости от требований вашего приложения
            secure: true, // Установите true, если используете HTTPS
          });

          return res.status(OK).send({ message: 'Авторизация успешна' });
        })
        .catch(next);
      return res.status(OK).send({ message: 'Авторизация успешна' });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Произошла ошибка при обновлении профиля.');
      }
      throw err;
    }).catch(next);
}; // обновляет профиль

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Произошла ошибка при обновлении аватара.');
      }
      throw err;
    }).catch(next);
};
