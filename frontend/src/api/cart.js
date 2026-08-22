import api from './axios';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data.data;
};

export const addToCart = async (data) => {
  const res = await api.post('/cart/add', data);
  return res.data.data;
};

export const updateCartItem = async (id, qty) => {
  const res = await api.put(`/cart/${id}`, null, {
    params: { quantity: qty }
  });
  return res.data.data;
};

export const removeCartItem = async (id) => {
  const res = await api.delete(`/cart/${id}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart/clear');
  return res.data.data;
};
