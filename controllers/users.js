const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');
const AuthError = require('../utils/AuthError');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, name, about, avatar,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email, name, about, avatar, password: hash,
      })
        .then((user) => { res.status(201).send(user); })
        .catch((err) => {
          next(err);
        });
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильный e-mail или пароль', 400));
      }
      return user;
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильный e-mail или пароль', 400));
          }
          return user;
        })
        .then(() => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Авторизация успешна!' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
