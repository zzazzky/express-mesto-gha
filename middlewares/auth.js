const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.cookies;
  if (!authorization) {
    next(new AuthError('Необходима авторизация', 401));
  }

  let payload;
  try {
    payload = jwt.verify(authorization, 'dev-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация', 401));
  }
  req.user = payload;
  next();
};

module.exports = auth;
