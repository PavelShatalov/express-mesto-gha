const router = require('express').Router();
const validation = require('../middlewares/validation');
const {
  getUsers, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', validation.getUser, getUserId); // возвращает пользователя по _id
router.get('/users/me', validation.getUser, getUserId); // возвращает информацию о текущем пользователе
router.patch('/users/me', validation.updateUser, updateUser); // обновляет профиль
router.patch('/users/me/avatar', validation.updateAvatar, updateAvatar); // обновляет аватар

module.exports = router;
