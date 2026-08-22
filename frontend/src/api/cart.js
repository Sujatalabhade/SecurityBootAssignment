import api from './axios';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (data) => {
  const res = await api.post('/cart', data);
  return res.data;
};

export const updateCartItem = async (id, qty) => {
  const res = await api.put(`/cart/${id}`, { quantity: qty });
  return res.data;
};

export const removeCartItem = async (id) => {
  const res = await api.delete(`/cart/${id}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart');
  return res.data;
};
