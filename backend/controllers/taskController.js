const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { userId: req.user.id };

    // Apply Filters
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }
    if (req.query.priority && req.query.priority !== 'all') {
      query.priority = req.query.priority;
    }

    // Apply Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Apply Sorting
    let sortConfig = { createdAt: -1 }; // default: newest
    if (req.query.sort === 'oldest') {
      sortConfig = { createdAt: 1 };
    } else if (req.query.sort === 'dueDate') {
      sortConfig = { dueDate: 1 };
    } else if (req.query.sort === 'priority') {
      // Map priority to values for sorting if possible, 
      // otherwise we fallback to a simpler sort or rely on default.
      // For string enums without aggregation, we sort descending alphabetically: 'Low' > 'Medium' > 'High' (not correct)
      // So priority sort is tricky server-side without schema changes, we'll leave it out or handle it gracefully.
      // To properly handle priority without schema change, we just sort by priority text as a fallback
      sortConfig = { priority: 1 };
    }

    // Fetch paginated tasks
    const tasks = await Task.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit);

    // Get total count for calculating total pages
    const total = await Task.countDocuments(query);

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

// @desc    Get task analytics
// @route   GET /api/tasks/analytics
// @access  Private
const getTaskAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ userId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    
    const now = new Date();
    // Overdue if status is pending, dueDate exists, and it's past
    // Normalizing now to start of day for accurate day-level comparison might be better,
    // but strict < now is fine for a general overdue definition.
    const overdueTasks = tasks.filter(t => 
      t.status === 'pending' && t.dueDate && new Date(t.dueDate) < now
    ).length;

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
      completionRate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get activity feed
// @route   GET /api/tasks/activities
// @access  Private
const getActivityFeed = async (req, res, next) => {
  try {
    const activities = await Activity.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Please add a title for the task');
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      category: category || 'Personal',
      dueDate,
      userId: req.user.id,
    });

    // Log Activity
    await Activity.create({
      userId: req.user.id,
      action: 'Task Created',
      taskId: task._id,
      taskTitle: task.title,
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

    // Determine if it was completed during this update
    let action = 'Task Updated';
    if (req.body.status === 'completed' && task.status !== 'completed') {
      action = 'Task Completed';
    }

    // Log Activity
    await Activity.create({
      userId: req.user.id,
      action: action,
      taskId: updatedTask._id,
      taskTitle: updatedTask.title,
    });

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

    // Log Activity
    await Activity.create({
      userId: req.user.id,
      action: 'Task Deleted',
      taskId: task._id,
      taskTitle: task.title,
    });

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

    const action = updatedTask.status === 'completed' ? 'Task Completed' : 'Task Updated';
    
    // Log Activity
    await Activity.create({
      userId: req.user.id,
      action: action,
      taskId: updatedTask._id,
      taskTitle: updatedTask.title,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskAnalytics,
  getActivityFeed,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
