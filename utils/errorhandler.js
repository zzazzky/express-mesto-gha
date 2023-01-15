const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const NotFoundError = require('./NotFoundError');

const handleError = (req, res) => {
  let ResStatus = 500;
  if (req.err instanceof ValidationError) {
    ResStatus = 400;
  } else if (req.err instanceof NotFoundError) {
    ResStatus = 404;
  }

  res.status(ResStatus).send({ message: req.err.message });
};

module.exports = { handleError };
