const express = require('express');

const router = express.Router();
const validation = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', validation.createCard, createCard); // создаёт карточку с переданными в теле запроса name и link
router.delete('/cards/:cardId', validation.idCard, deleteCard); // удаляет карточку по _id
router.put('/cards/:cardId/likes', validation.idCard, likeCard); // поставить лайк карточке
router.delete('/cards/:cardId/likes', validation.idCard, dislikeCard); // убрать лайк с карточки
module.exports = router;
