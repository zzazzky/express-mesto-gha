const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { handleError } = require('../utils/errorhandler');

router.get('', getAllUsers);
router.get('', handleError);

router.get('/:userId', getUserById);
router.get('/:userId', handleError);

router.post('', createUser);
router.post('', handleError);

router.patch('/me', updateProfile);
router.patch('/me', handleError);

router.patch('/me/avatar', updateAvatar);
router.patch('/me/avatar', handleError);

module.exports = router;
