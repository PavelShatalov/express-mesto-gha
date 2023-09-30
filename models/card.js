const mongoose = require('mongoose');

const regexLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexLink.test(v),
      message: 'Неверный формат ссылки',
    },
    //   validator: (v) => validator.isURL(v),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Ссылка на модель пользователя
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Ссылка на модель пользователя
      default: [], // По умолчанию — пустой массив
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);
