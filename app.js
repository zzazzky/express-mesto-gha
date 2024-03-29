const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { handleError } = require('./utils/errorhandler');

const { PORT = 3000 } = process.env;

const app = express();

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');
const NotFoundError = require('./utils/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // Ошибка config вызвана \ в регулярном выражении. Если не использовать \, валидация некорректна
    // eslint-disable-next-line
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-z]+.[a-z]+[a-zA-Z0-9\/\-\._~:\?#\[\]@!\$&'\(\)\*\+,;=]+/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.use(errors());
app.use((req, res, next) => {
  const err = new NotFoundError('Страница не найдена');
  next(err);
});
app.use(handleError);

app.listen(PORT);
