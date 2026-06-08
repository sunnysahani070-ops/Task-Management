const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskAnalytics,
  getActivityFeed,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/analytics').get(protect, getTaskAnalytics);
router.route('/activities').get(protect, getActivityFeed);

router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.route('/:id/status').patch(protect, toggleTaskStatus);

module.exports = router;
