import api from './api';

const getTasks = async (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  
  const response = await api.get(`/api/tasks?${params.toString()}`);
  return response.data;
};

const getAnalytics = async () => {
  const response = await api.get('/api/tasks/analytics');
  return response.data;
};

const getActivities = async () => {
  const response = await api.get('/api/tasks/activities');
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

const toggleTaskStatus = async (id) => {
  const response = await api.patch(`/api/tasks/${id}/status`);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

export default {
  getTasks,
  getAnalytics,
  getActivities,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
