// const jwt = require('jsonwebtoken');
// const {
//   UnauthorizedError,
// } = require('../errors/index');

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return next(new UnauthorizedError('Необходима авторизация'));
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(
//       token,
//       'your-secret-key',
//     );
//   } catch (err) {
//     return next(new UnauthorizedError('Необходима авторизация'));
//   }

//   req.user = payload;

//   return next();
// };
// module.exports = auth;
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/index');

const auth = (req, res, next) => {
  // Получите токен из куки с именем "jwt"
  const token = req.cookies.jwt;
  // Проверьте наличие токена
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    // Верифицируйте токен с использованием секретного ключа
    payload = jwt.verify(token, 'your-secret-key'); // Замените на ваш секретный ключ
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  // Добавьте пейлоуд токена к объекту запроса
  req.user = payload;
  next();
};
module.exports = auth;
