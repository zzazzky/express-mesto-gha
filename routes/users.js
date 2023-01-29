const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('', getAllUsers);

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
  // Ошибка config вызвана \ в регулярном выражении. Если не использовать \, валидация некорректна
  // eslint-disable-next-line
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-z]+.[a-z]+[a-zA-Z0-9\/\-\._~:\?#\[\]@!\$&'\(\)\*\+,;=]+/),
  }),
}), updateAvatar);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

module.exports = router;
