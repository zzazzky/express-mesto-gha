const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('', getAllUsers);

router.get('/:userId', getUserById);

router.get('/me', getCurrentUser);
router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
