const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true, // уникальное значение
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v), // валидация почты
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // не будет возвращаться пользователю
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // попытаемся найти пользовател по почте
  return this.findOne({ email })
    .select('+password') // вернём хеш пароля
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // если пользователь есть, то сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
