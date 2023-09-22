const User = require('../models/user'); // импортируем модель

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
 };
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports.CreateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || name.length < 2 || name.length > 30 || !about || !avatar) {
    return res.status(400).send({ message: 'Некорректные данные' });
  }

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
 };
 module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }else if(!req.body.name || !req.body.about) {
        res.status(400).send({ message: 'Некорректные данные' });
      }
      else {
        res.send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
 }; // обновляет профиль
 module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      } else if(!req.body.avatar) {
        res.status(400).send({ message: 'Некорректные данные' });
      }
      else {
        res.send(user);
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
 };  // обновляет аватар