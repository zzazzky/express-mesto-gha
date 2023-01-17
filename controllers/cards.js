const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.body.user;

  Card.create({ name, link, owner })
    .then((card) => Card.findById(card.id).populate(['owner', 'likes']))
    .then((card) => { res.status(201).send(card); })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Публикация не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.body.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Публикация не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.body.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Публикация не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
