const router = require('express').Router();
const { getUsers, getUserId, CreateUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUserId); // возвращает пользователя по _id
router.post('/users', CreateUser); // создаёт пользователя  с переданными в теле запроса name, about и avatar
router.patch('/users/me', updateUser); // обновляет профиль
router.patch('/users/me/avatar', updateAvatar); // обновляет аватар
module.exports = router;
