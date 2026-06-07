const Task = require('../models/Task');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch paginated tasks
    const tasks = await Task.find({ userId: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for calculating total pages
    const total = await Task.countDocuments({ userId: req.user.id });

    res.status(200).json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please add a title for the task');
    }

    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure user is attached to request
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged-in user matches the task's user
    if (task.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure user is attached to request
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged-in user matches the task's user
    if (task.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized to delete this task');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure user is attached to request
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged-in user matches the task's user
    if (task.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized to update this task');
    }

    // Toggle status
    task.status = task.status === 'pending' ? 'completed' : 'pending';
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
