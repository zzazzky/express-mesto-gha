const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const { CastError } = mongoose.Error.CastError;
const NotFoundError = require('./NotFoundError');
const AuthError = require('./AuthError');

const handleError = (err, req, res, next) => {
  let ResStatus = 500;
  if (err.code === 11000) {
    ResStatus = 409;
    res.status(ResStatus).send({ message: 'Пользователь с таким e-mail уже существует' });
    next();
  } else if (err instanceof NotFoundError || err instanceof AuthError) {
    ResStatus = err.statusCode;
    res.status(ResStatus).send({ message: err.message });
    next();
  } else if (err instanceof ValidationError || err instanceof CastError) {
    ResStatus = 400;
    res.status(ResStatus).send({ message: err.message });
    next();
  } else {
    console.log(err.message);
    res.status(ResStatus).send({ message: 'Ой! Произошла ошибка на сервере, попробуйте еще раз' });
    next();
  }
};

module.exports = { handleError };
