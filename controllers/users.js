const User = require('../models/user');
const NotFoundError = require('../utils/NotFoundError');

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

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => { res.status(201).send(user); })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.body.user;

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

  const { _id } = req.body.user;

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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
