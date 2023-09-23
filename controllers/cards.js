const http = require('http');
const Card = require('../models/card'); // импортируем модель

const BAD_REQUEST = http.STATUS_CODES[400];
const NOT_FOUND = http.STATUS_CODES[404];
const INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}; // возвращает все карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || name.length < 2 || name.length > 30 || !link) {
    return res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
  }
  Card.create({ name, link })
    .then((card) => res.status(200).send({
      likes: card.likes,
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: {
        name: card.owner.name,
        about: card.owner.about,
        avatar: card.owner.avatar,
        _id: card.owner._id,
      },
    })) //
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Произошла ошибка при создании пользователя.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
  return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
};

// создаёт карточку с переданными в теле запроса name и link
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return card.deleteOne().then(() => res.status(200).send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Произошла ошибка при поиске карточки.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}; // удаляет карточку по _id

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } }, // добавить userId в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // Если карточка не найдена, отправить 404 ошибку
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      // Вернуть обновленную карточку
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Произошла ошибка при поиске карточки.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } }, // убрать userId из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // Если карточка не найдена, отправить 404 ошибку
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      // Вернуть обновленную карточку
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Произошла ошибка при поиске карточки.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
