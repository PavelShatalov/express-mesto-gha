// const http = require('http');
const Card = require('../models/card'); // импортируем модель
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/index');

// const BAD_REQUEST = http.STATUS_CODES[400];
// const NOT_FOUND = http.STATUS_CODES[404];
// const INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];
// const OK = http.STATUS_CODES[200];
// const FORBIDDEN = http.STATUS_CODES[403];
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
}; // возвращает все карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card })) //
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы невалидные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};// создаёт карточку с переданными в теле запроса name и link

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== req.user.id) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }
      // Если пользователь является владельцем, удаляем карточку
      return card.deleteOne().then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки.'));
        return;
      }
      next(err);
    });
};// удаляет карточку по _id

module.exports.likeCard = (req, res, next) => {
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
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      // Вернуть обновленную карточку
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      // Вернуть обновленную карточку
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID карточки.'));
        return;
      }
      next(err);
    });
};
