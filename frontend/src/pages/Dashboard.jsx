import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import taskService from '../services/taskService';
import AddTask from '../components/AddTask';
import TaskCard from '../components/TaskCard';
import EditTaskModal from '../components/EditTaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import TaskSkeleton from '../components/TaskSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { useToast } from '../context/ToastContext';
import { FaCheckCircle, FaSearch, FaClipboardList, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ThemeToggle from '../components/ui/ThemeToggle';
import FilterBar from '../components/FilterBar';
import AnalyticsCards from '../components/AnalyticsCards';
import TaskCompletionChart from '../components/TaskCompletionChart';
import ActivityTimeline from '../components/ActivityTimeline';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshAnalyticsTrigger, setRefreshAnalyticsTrigger] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // We'll manage triggering fetchTasks within a single useEffect
  // that depends on all relevant state variables.


  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const data = await taskService.getAnalytics();
        setAnalyticsData(data);
        setAnalyticsLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setAnalyticsLoading(false);
      }
    };
    getAnalytics();
  }, [refreshAnalyticsTrigger]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await taskService.getActivities();
        setActivities(data);
        setActivitiesLoading(false);
      } catch (err) {
        console.error('Failed to fetch activities', err);
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, [refreshAnalyticsTrigger]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  // When any filter changes, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterCategory, filterPriority, searchQuery, sortOption]);

  // Fetch tasks whenever page, filters, or refresh trigger changes
  useEffect(() => {
    fetchTasks();
  }, [currentPage, filterStatus, filterCategory, filterPriority, searchQuery, sortOption, refreshAnalyticsTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(currentPage, 10, {
        status: filterStatus,
        category: filterCategory,
        priority: filterPriority,
        search: searchQuery,
        sort: sortOption
      });
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
    setRefreshAnalyticsTrigger((prev) => prev + 1);
    // If not on page 1, resetting it to 1 will trigger a fetch
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const onToggleStatus = async (id) => {
    try {
      const updatedTask = await taskService.toggleTaskStatus(id);
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      setRefreshAnalyticsTrigger((prev) => prev + 1);
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
      setRefreshAnalyticsTrigger((prev) => prev + 1);
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
    setRefreshAnalyticsTrigger((prev) => prev + 1);
  };

  // Note: Filtering and Sorting is now fully handled on the server


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex justify-center items-center shadow-sm">
              <FaCheckCircle className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Task<span className="text-indigo-600 dark:text-indigo-400">Manager</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
              Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:text-indigo-400"
              icon={FaUser}
            >
              Profile
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-500"
              icon={FaSignOutAlt}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Top Section: Analytics & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
            <AnalyticsCards data={analyticsData} loading={analyticsLoading} />
          </div>
          <div className="lg:col-span-4">
            <TaskCompletionChart data={analyticsData} loading={analyticsLoading} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Task Form & Activity Timeline (Left Column) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-8">
            <AddTask onTaskAdded={handleTaskAdded} />
            <ActivityTimeline activities={activities} loading={activitiesLoading} />
          </div>

          {/* Task List (Right Column) */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Card className="min-h-[500px] flex flex-col">
              <CardContent className="flex-1 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-700 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
                    <Badge variant="primary">
                      {tasks.length} {totalPages > 1 ? `on this page` : 'total'}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                    <FilterBar
                      searchInput={searchInput}
                      setSearchInput={setSearchInput}
                      filterStatus={filterStatus}
                      setFilterStatus={setFilterStatus}
                      filterCategory={filterCategory}
                      setFilterCategory={setFilterCategory}
                      filterPriority={filterPriority}
                      setFilterPriority={setFilterPriority}
                      sortOption={sortOption}
                      setSortOption={setSortOption}
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <TaskSkeleton key={i} />)}
                  </div>
                ) : tasks.length === 0 ? (
                  <EmptyState 
                    type={
                      (filterStatus === 'all' && filterCategory === 'all' && filterPriority === 'all' && !searchQuery)
                        ? 'no-tasks' 
                        : (filterStatus === 'Completed' && !searchQuery && filterCategory === 'all' && filterPriority === 'all') 
                          ? 'no-completed' 
                          : 'no-search-results'
                    }
                    clearFilters={() => {
                      setFilterStatus('all');
                      setFilterCategory('all');
                      setFilterPriority('all');
                      setSearchInput('');
                      setSearchQuery('');
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        onToggleStatus={onToggleStatus} 
                        onDeleteTask={onDeleteTask} 
                        onEditTask={onEditTask} 
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {!loading && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        task={editingTask} 
        onTaskUpdated={handleTaskUpdated} 
      />

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
