// Description: точка входа в приложение  Express
const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
// const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '650cea96977061048268ae87' };
  next();
});

app.use(require('./routes/users'));

app.use(require('./routes/cards'));

app.use('*', (req, res) => { res.status(404).send({ message: 'не существующий маршрут' }); });
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Успешное подключение к MongoDB');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => { console.error('Ошибка подключения к MongoDB:', error); });
