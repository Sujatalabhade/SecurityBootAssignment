import api from './axios';

export const getInventory = async (params) => {
  const res = await api.get('/manager/inventory', { params });
  return res.data.data;
};

export const updateStock = async (data) => {
  const res = await api.put('/manager/inventory', data);
  return res.data.data;
};

export const getStats = async () => {
  const res = await api.get('/manager/stats');
  return res.data.data;
};
