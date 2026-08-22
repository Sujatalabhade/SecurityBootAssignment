import api from './axios';

export const placeOrder = async (data) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get('/orders');
  return res.data;
};

export const getOrder = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await api.post(`/orders/${id}/cancel`);
  return res.data;
};
