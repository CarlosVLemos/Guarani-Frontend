import apiClient from './index';

// --- Comprador: Documents ---

/**
 * Lista os documentos do perfil de um comprador.
 * @param {object} params Parâmetros de query (paginaçao, etc).
 * @returns {Promise} A promessa da chamada da API.
 */
export const getCompradorDocuments = (params) => {
  return apiClient.get('/users/comprador-documents/', { params });
};

/**
 * Envia um novo documento para o perfil do comprador.
 * @param {FormData} documentData Geralmente um FormData para upload de arquivo.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createCompradorDocument = (documentData) => {
  return apiClient.post('/users/comprador-documents/', documentData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Obtém um documento específico pelo ID.
 * @param {string} id O UUID do documento.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getCompradorDocumentById = (id) => {
  return apiClient.get(`/users/comprador-documents/${id}/`);
};

/**
 * Atualiza um documento específico.
 * @param {string} id O UUID do documento.
 * @param {object} documentData Os dados a serem atualizados.
 * @returns {Promise} A promessa da chamada da API.
 */
export const updateCompradorDocument = (id, documentData) => {
  return apiClient.put(`/users/comprador-documents/${id}/`, documentData);
};

/**
 * Atualiza parcialmente um documento específico.
 * @param {string} id O UUID do documento.
 * @param {object} documentData Os dados a serem atualizados.
 * @returns {Promise} A promessa da chamada da API.
 */
export const patchCompradorDocument = (id, documentData) => {
  return apiClient.patch(`/users/comprador-documents/${id}/`, documentData);
};

/**
 * Deleta um documento específico.
 * @param {string} id O UUID do documento.
 * @returns {Promise} A promessa da chamada da API.
 */
export const deleteCompradorDocument = (id) => {
  return apiClient.delete(`/users/comprador-documents/${id}/`);
};

// --- Comprador: Organizations ---

/**
 * Lista as organizações de compradores.
 * @param {object} params Parâmetros de query.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getCompradorOrganizations = (params) => {
  return apiClient.get('/users/comprador-organizations/', { params });
};

/**
 * Cria uma nova organização de comprador.
 * @param {object} organizationData Dados da organização.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createCompradorOrganization = (organizationData) => {
  return apiClient.post('/users/comprador-organizations/', organizationData);
};

// --- Comprador: Profiles ---

/**
 * Lista os perfis de compradores.
 * @param {object} params Parâmetros de query.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getCompradorProfiles = (params) => {
  return apiClient.get('/users/comprador-profiles/', { params });
};

/**
 * Cria um novo perfil de comprador.
 * @param {object} profileData Dados do perfil.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createCompradorProfile = (profileData) => {
  return apiClient.post('/users/comprador-profiles/', profileData);
};
// --- Comprador: Requirements ---

/**
 * Lista os requisitos de compradores.
 * @param {object} params Parâmetros de query.
 * @returns {Promise} A promessa da chamada da API.
 */
export const getCompradorRequirements = (params) => {
  return apiClient.get('/users/comprador-requirements/', { params });
};

/**
 * Cria um novo requisito de comprador.
 * @param {object} requirementData Dados do requisito.
 * @returns {Promise} A promessa da chamada da API.
 */
export const createCompradorRequirement = (requirementData) => {
  return apiClient.post('/users/comprador-requirements/', requirementData);
};