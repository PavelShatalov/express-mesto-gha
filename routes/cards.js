const express = require('express');

const router = express.Router();
const validation = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', validation.createCard, createCard); // создаёт карточку с переданными в теле запроса name и link
router.delete('/:cardId', validation.idCard, deleteCard); // удаляет карточку по _id
router.put('/:cardId/likes', validation.idCard, likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', validation.idCard, dislikeCard); // убрать лайк с карточки
module.exports = router;
