const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');

const throwNotFoundError = () => Promise.reject(new NotFoundError('Публикация не найдена'));

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      req.err = err;
      next();
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { owner } = req.body.user;

  Card.create({ name, link, owner })
    .then((card) => { res.send(card); })
    .catch((err) => {
      req.err = err;
      next();
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return throwNotFoundError();
      }
      return res.send(card);
    })
    .catch((err) => {
      req.err = err;
      next();
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return throwNotFoundError();
      }
      return res.send(card);
    })
    .catch((err) => {
      req.err = err;
      next();
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return throwNotFoundError();
      }
      return res.send(card);
    })
    .catch((err) => {
      req.err = err;
      next();
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
