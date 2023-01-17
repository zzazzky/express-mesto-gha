const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const { CastError } = mongoose.Error.CastError;
const NotFoundError = require('./NotFoundError');

const handleError = (err, req, res, next) => {
  let ResStatus = 500;
  if (err instanceof NotFoundError) {
    ResStatus = err.statusCode;
    res.status(ResStatus).send({ message: err.message });
    next();
  } else if (err instanceof ValidationError || CastError) {
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
