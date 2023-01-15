const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const { CastError } = mongoose.Error.CastError;
const NotFoundError = require('./NotFoundError');

const handleError = (req, res) => {
  let ResStatus = 500;
  if (req.err instanceof NotFoundError) {
    ResStatus = req.err.statusCode;
  } else if (req.err instanceof ValidationError || CastError) {
    ResStatus = 400;
  }

  res.status(ResStatus).send({ message: `${ResStatus} ${req.err.name}, ${req.err.message}` });
};

module.exports = { handleError };
