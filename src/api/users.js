import apiClient from './index';

// Usuários API

// (operationId: users_list)
export const getUsers = (params) => {
  return apiClient.get('/users/', { params });
};

// (operationId: users_create)
export const createUser = (userData) => {
  return apiClient.post('/users/', userData);
};

// (operationId: users_retrieve)
export const getUserById = (id) => {
  return apiClient.get(`/users/${id}/`);
};

// (operationId: users_update)
export const updateUser = (id, userData) => {
  return apiClient.put(`/users/${id}/`, userData);
};

// (operationId: users_partial_update)
export const patchUser = (id, userData) => {
  return apiClient.patch(`/users/${id}/`, userData);
};

// (operationId: users_destroy)
export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}/`);
};

// (operationId: users_verify_create)
export const verifyUser = (id, verificationData) => {
    return apiClient.post(`/users/${id}/verify/`, verificationData);
};
