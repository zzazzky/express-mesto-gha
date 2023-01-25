const jwt = require('jsonwebtoken');
const AuthError = require('../utils/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.cookies;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new AuthError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }
  const token = authorization.replace('Bearer ');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  return next();
};

module.exports = auth;
