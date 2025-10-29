import apiClient from './index';

// --- Ofertante: Documents ---

/**
 * Lista os documentos do perfil de um ofertante.
 * @param {object} params Parâmetros de query (paginaçao, etc).
 * @returns {Promise} A promessa da chamada da API.
 */
export const getOfertanteDocuments = (params) => {
  return apiClient.get('/users/ofertante-documents/', { params });
};

/**
 * Envia um novo documento para o perfil do ofertante.
 * @param {FormData} documentData Geralmente um FormData para upload de arquivo.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createOfertanteDocument = (documentData) => {
  return apiClient.post('/users/ofertante-documents/', documentData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Obtém um documento específico de um ofertante pelo ID.
 * @param {string} id O UUID do documento.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getOfertanteDocumentById = (id) => {
  return apiClient.get(`/users/ofertante-documents/${id}/`);
};

/**
 * Atualiza um documento específico de um ofertante.
 * @param {string} id O UUID do documento.
 * @param {object} documentData Os dados a serem atualizados.
 * @returns {Promise} A promessa da chamada da API.
 */
export const updateOfertanteDocument = (id, documentData) => {
  return apiClient.put(`/users/ofertante-documents/${id}/`, documentData);
};

// ... (PATCH e DELETE para documents seguem o mesmo padrão)

// --- Ofertante: Profiles ---

/**
 * Lista os perfis de ofertantes.
 * @param {object} params Parâmetros de query.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getOfertanteProfiles = (params) => {
  return apiClient.get('/users/ofertante-profiles/', { params });
};

/**
 * Cria um novo perfil de ofertante.
 * @param {object} profileData Dados do perfil.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createOfertanteProfile = (profileData) => {
  return apiClient.post('/users/ofertante-profiles/', profileData);
};

// ... (GET by ID, PUT, PATCH, DELETE para profiles seguem o mesmo padrão)
