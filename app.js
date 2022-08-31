const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./utils/limiter/limiter');
const { dataMovies, PORT } = require('./utils/config/database');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { corsRules } = require('./middlewares/cors');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsRules);

// подключаемся к серверу mongo
mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(require('./utils/config/errorConfig'));

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
