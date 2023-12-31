// Description: точка входа в приложение  Express
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
// const { router } = require('./routes/index');
// const cookieParser = require('cookie-parser');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const validation = require('./middlewares/validation');

const centralError = require('./middlewares/centralError');

const { PORT = 3000 } = process.env;

const {
  NotFoundError,
} = require('./errors/index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(router);
// app.use(cookieParser());

app.post('/signin', validation.signUser, login);
app.post('/signup', validation.login, createUser);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
});

// app.use('/users', require('./routes/users'));
// app.use('/cards', require('./routes/cards'));

// app.use('*', (req, res, next) => {
//   next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
// });
app.use(errors());
app.use(centralError);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Успешное подключение к MongoDB');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => { console.error('Ошибка подключения к MongoDB:', error); });
