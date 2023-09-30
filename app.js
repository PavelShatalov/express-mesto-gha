// Description: точка входа в приложение  Express
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralError = require('./middlewares/centralError');
const validation = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.post('/signin', login);
// app.post('/signup', createUser);
app.post('/signin', validation.login, login);
app.post('/signup', validation.createUser, createUser);
app.use(auth);
app.use(routes);

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
