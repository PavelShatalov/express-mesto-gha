// const express = require('express');
// const mongoose = require('mongoose');
// const { PORT = 3000 } = process.env;
// // const { usersRouter } = require('./routes/users');
// // const { cardsRouter } = require('./routes/cards');
// // const PORT = 3000;
// const app = express();


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(require('./routes/users'));
// app.use(require('./routes/cards'));
// // mongoose.connect('mongodb://localhost:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true }, function(error) {
//   if (error) {
//     console.error('Ошибка подключения к MongoDB:', error);
//   } else {
//     console.log('Успешное подключение к MongoDB');
//   }
// });
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '650cea96977061048268ae87' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(require('./routes/users'));
app.use(require('./routes/cards'));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Успешное подключение к MongoDB');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });
