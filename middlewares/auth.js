const jwt = require('jsonwebtoken');
const {
  NotFoundError,
} = require('../errors/index');

module.exports = (req, res, next) => {
  // Получите токен из заголовка Authorization (или из куки, если вы используете куки)
  const token = req.cookies.jwt;
  // Проверьте наличие токена
  if (!token) {
    throw new NotFoundError('Необходима авторизация');
  }
  let payload;
  try {
    // Верифицируйте токен с использованием секретного ключа
    payload = jwt.verify(token, 'your-secret-key'); // Замените на ваш секретный ключ

    // Добавьте пейлоуд токена к объекту запроса
    req.user = payload;

    next();
  } catch (err) {
    throw new NotFoundError('Необходима авторизация');
  }
  throw new NotFoundError('Необходима авторизация');
};
