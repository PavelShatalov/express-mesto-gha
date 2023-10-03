const express = require('express');

const router = express.Router();
const validation = require('../middlewares/validation');
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей
router.get('/me', getUserId); // возвращает информацию о текущем пользователе
router.get('/:userId', validation.getUser, getUserId); // возвращает пользователя по _id
router.patch('/me', validation.updateUser, updateUser); // обновляет профиль
router.patch('/me/avatar', validation.updateAvatar, updateAvatar); // обновляет аватар

module.exports = router;
