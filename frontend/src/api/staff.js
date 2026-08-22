import api from './axios';

export const getStaffOrders = async (params) => {
  const res = await api.get('/staff/orders', { params });
  return res.data.data;
};

export const updateOrderStatus = async (id, data) => {
  const res = await api.put(`/staff/orders/${id}/status`, data);
  return res.data.data;
};

export const getPickupOrders = async () => {
  const res = await api.get('/staff/pickup');
  return res.data.data;
};

export const getDeliveryOrders = async () => {
  const res = await api.get('/staff/delivery');
  return res.data.data;
};

export const getPendingReturns = async () => {
  const res = await api.get('/staff/returns');
  return res.data.data;
};

export const processReturn = async (id, approved, notes) => {
  const res = await api.put(`/staff/returns/${id}/process`, null, {
    params: { approved, notes }
  });
  return res.data.data;
};
