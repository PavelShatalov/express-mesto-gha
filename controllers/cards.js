const Card = require('../models/card'); // импортируем модель

module.exports.getCards = (req, res) => {
  if (!Card) {
    res.status(404).send({ message: 'Карточки не найдены' });
  }
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

}; // возвращает все карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || name.length < 2 || name.length > 30 || !link) {
    return res.status(400).send({ message: 'Некорректные данные' });
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
      }

    })) //
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};



// создаёт карточку с переданными в теле запроса name и link
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  // if (!cardId.cardId) {
  //   return res.status(400).send({ message: 'Передан некорректный _id карточки.' });
  // }
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        return card.deleteOne().then(() => res.status(200).send({ message: 'Пост удалён' }));
      }
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
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
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      // Вернуть обновленную карточку
      return res.status(200).send(card);
    })
    .catch((err) => {
      // Обработка ошибок базы данных
      console.error(err);
      res.status(400).send({ message: 'Ошибка сервера. Попробуйте позже.' });
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
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      // Вернуть обновленную карточку
      return res.send(card);
    })
    .catch((err) => {
      // Обработка ошибок базы данных
      console.error(err);
      res.status(400).send({ message: 'Ошибка сервера. Попробуйте позже.' });
    });
};
