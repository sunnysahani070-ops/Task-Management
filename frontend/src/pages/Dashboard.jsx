import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import taskService from '../services/taskService';
import AddTask from '../components/AddTask';
import TaskCard from '../components/TaskCard';
import EditTaskModal from '../components/EditTaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import TaskSkeleton from '../components/TaskSkeleton';
import { useToast } from '../context/ToastContext';
import { FaCheckCircle, FaSearch, FaClipboardList } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form state moved to AddTask component

  // Initial Fetch & Page Change
  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(currentPage, 5);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || 'Failed to fetch tasks', 'error');
    }
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTaskAdded = () => {
    if (currentPage === 1) {
      fetchTasks();
    } else {
      setCurrentPage(1);
    }
  };

  const onToggleStatus = async (id) => {
    try {
      const updatedTask = await taskService.toggleTaskStatus(id);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      showToast('Task status updated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task status', 'error');
    }
  };

  const onDeleteTask = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      setTaskToDelete(task);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.deleteTask(taskToDelete._id);
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id));
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
      setIsDeleteModalOpen(false);
    }
  };

  const onEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
  };

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter((task) => {
    // 1. Check status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }

    // 2. Check search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 1. Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex justify-center items-center">
              <FaCheckCircle className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Task<span className="text-indigo-600">Manager</span></h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 text-sm hidden sm:block">
              Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span>
            </span>
            {/* 4. Logout Button */}
            <button
              onClick={onLogout}
              className="text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 py-1.5 px-3 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. Add Task Form (Left Column) */}
          <div className="lg:col-span-1">
            <AddTask onTaskAdded={handleTaskAdded} />
          </div>

          {/* 3. Task List (Right Column) */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 min-h-[400px]">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Your Tasks</h2>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    {filteredTasks.length} {filteredTasks.length !== tasks.length ? `of ${tasks.length}` : 'total'}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full sm:w-36 pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer text-gray-700"
                  >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <TaskSkeleton key={i} />)}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="bg-indigo-50/50 p-6 rounded-full mb-5 border border-indigo-100 shadow-inner">
                    <FaClipboardList className="text-indigo-400" size={56} />
                  </div>
                  <h3 className="text-gray-900 text-xl font-bold tracking-tight">
                    {tasks.length === 0 ? 'You are all caught up!' : 'No matching tasks'}
                  </h3>
                  <p className="text-gray-500 text-base mt-2 max-w-sm">
                    {tasks.length === 0 
                      ? 'You currently have no tasks. Use the form to create your first task and get started.'
                      : 'No tasks match your current search or filter criteria.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        onToggleStatus={onToggleStatus} 
                        onDeleteTask={onDeleteTask} 
                        onEditTask={onEditTask} 
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || loading}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || loading}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Task Modal */}
      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        task={editingTask} 
        onTaskUpdated={handleTaskUpdated} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        taskName={taskToDelete?.title}
      />
    </div>
  );
};

export default Dashboard;
