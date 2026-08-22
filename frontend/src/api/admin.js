import api from './axios';

export const getUsers = async (params) => {
  const res = await api.get('/admin/users', { params });
  return res.data.data;
};

export const assignRole = async (id, data) => {
  const res = await api.put(`/admin/users/${id}/role`, data);
  return res.data.data;
};

export const getAuditLogs = async (params) => {
  const res = await api.get('/admin/audit-logs', { params });
  return res.data.data;
};
