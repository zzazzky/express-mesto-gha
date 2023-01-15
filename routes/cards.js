const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { handleError } = require('../utils/errorhandler');

router.get('', getAllCards);
router.get('', handleError);

router.post('', createCard);
router.post('', handleError);

router.delete('/:cardId', deleteCard);
router.delete('/:cardId', handleError);

router.put('/:cardId/likes', likeCard);
router.put('/:cardId/likes', handleError);

router.delete('/:cardId/likes', dislikeCard);
router.delete('/:cardId/likes', handleError);

module.exports = router;
