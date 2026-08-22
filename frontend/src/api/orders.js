import api from './axios';

export const placeOrder = async (data) => {
  const res = await api.post('/orders', data);
  return res.data.data;
};

export const getOrders = async () => {
  const res = await api.get('/orders');
  return res.data.data;
};

export const getOrder = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.data;
};

export const cancelOrder = async (id) => {
  const res = await api.put(`/orders/${id}/cancel`);
  return res.data.data;
};
