import api from './api';

const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

const resetPassword = async (id, token, password) => {
  const response = await api.post(`/api/auth/reset-password/${id}/${token}`, { password });
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.get(`/api/auth/verify-email/${token}`);
  return response.data;
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
