import api from './axios';

export const getStaffOrders = async (params) => {
  const res = await api.get('/staff/orders', { params });
  return res.data;
};

export const updateOrderStatus = async (id, data) => {
  const res = await api.put(`/staff/orders/${id}/status`, data);
  return res.data;
};

export const getPickupOrders = async () => {
  const res = await api.get('/staff/orders/pickup');
  return res.data;
};

export const getDeliveryOrders = async () => {
  const res = await api.get('/staff/orders/delivery');
  return res.data;
};

export const getPendingReturns = async () => {
  const res = await api.get('/staff/returns/pending');
  return res.data;
};

export const processReturn = async (id, data) => {
  const res = await api.put(`/staff/returns/${id}`, data);
  return res.data;
};
