import api from './api';

const getTasks = async (page = 1, limit = 5) => {
  const response = await api.get(`/api/tasks?page=${page}&limit=${limit}`);
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
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
