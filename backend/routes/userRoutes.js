const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/password').put(protect, updatePassword);

module.exports = router;
