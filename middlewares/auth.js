const jwt = require('jsonwebtoken');
const {
  UnauthorizedError,
} = require('../errors/index');

const auth = (req, res, next) => {
  // Получите токен из заголовка Authorization (или из куки, если вы используете куки)
  const token = req.cookies.jwt;
  // Проверьте наличие токена
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    // Верифицируйте токен с использованием секретного ключа
    payload = jwt.verify(token, 'your-secret-key'); // Замените на ваш секретный ключ
  } catch (err) { next(new UnauthorizedError('Необходима авторизация')); } // Добавьте пейлоуд токена к объекту запроса
  req.user = payload;
  return next();
};
module.exports = auth;
