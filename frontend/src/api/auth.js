import api from './axios';

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data.data; // unwrap ApiResponse -> inner data {token, role, name, email, userId}
};

export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/auth/update', data);
  return res.data.data;
};
