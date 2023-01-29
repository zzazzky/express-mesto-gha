const Card = require('../models/card');
const NotFoundError = require('../utils/NotFoundError');
const AuthError = require('../utils/AuthError');

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
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => Card.findById(card.id).populate(['owner', 'likes']))
    .then((card) => { res.status(201).send(card); })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Публикация не найдена'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id.toString()) {
        return Promise.reject(new AuthError('Вы не можете удалить чужую публикацию!', 403));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => { res.status(200).send(card); });
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Публикация не найдена'))
    .then((card) => { res.send(card); })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Публикация не найдена'))
    .then((card) => { res.send(card); })
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
