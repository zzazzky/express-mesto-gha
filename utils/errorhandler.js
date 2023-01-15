const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const { CastError } = mongoose.Error.CastError;
const NotFoundError = require('./NotFoundError');

const handleError = (req, res) => {
  let ResStatus = 500;
  if (req.err instanceof ValidationError || CastError) {
    ResStatus = 400;
  } else if (req.err instanceof NotFoundError) {
    ResStatus = 404;
  }

  res.status(ResStatus).send({ message: req.err.message });
};

module.exports = { handleError };
