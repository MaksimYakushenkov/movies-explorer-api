const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./utils/limiter/limiter');
const { dataMovies, PORT } = require('./utils/config/database');
const NotFoundError = require('./utils/errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsRules } = require('./middlewares/cors');

const app = express();

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsRules);

// подключаемся к серверу mongo
mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(require('./routes/index'));

app.use('*', (req, res, next) => next(new NotFoundError('Неверный URl')));

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
