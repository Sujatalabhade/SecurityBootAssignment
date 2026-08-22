import api from './axios';

export const createReturn = async (data) => {
  const res = await api.post('/returns', data);
  return res.data.data;
};

export const getMyReturns = async () => {
  const res = await api.get('/returns');
  return res.data.data;
};
