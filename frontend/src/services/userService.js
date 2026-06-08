import api from './api';

const getUserProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await api.put('/api/users/profile', userData);
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.put('/api/users/password', passwordData);
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
  changePassword,
};
