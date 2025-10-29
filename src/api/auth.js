import apiClient from './index';
// Autenticação de Usuário


// (operationId: users_login_create)
export const login = (credentials) => {
  // credentials deve ser um objeto como { email, password }
  return apiClient.post('/users/login/', credentials);
};

// (operationId: users_login_refresh_create)
export const refreshToken = (refresh) => {
  // refresh deve ser o token de atualização recebido no login
  return apiClient.post('/users/login/refresh/', { refresh });
};

// (operationId: users_register_create)
export const register = (userData) => {
  return apiClient.post('/users/register/', userData);
};
