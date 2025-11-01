import apiClient from './index';

/**
 * Lista as transações de marketplace do usuário logado.
 * @param {object} params Parâmetros de query como paginação, ordenação e busca.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getTransactions = (params) => {
  return apiClient.get('/marketplace/transactions/', { params });
};

export const getPublicTransactions = (params) => {
  return apiClient.get('/marketplace/public-transactions/', { params });
};

/**
 * Cria uma nova transação de marketplace (compra de créditos).
 * @param {object} transactionData Os dados da nova transação.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createTransaction = (transactionData) => {
  return apiClient.post('/marketplace/transactions/', transactionData);
};
