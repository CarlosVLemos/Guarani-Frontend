import apiClient from './index';

//projetos API

export const getProjects = (params) => {
  return apiClient.get('/projects/', { params });
};

export const getProjectById = (id) => {
  return apiClient.get(`/projects/${id}/`);
};

export const createProject = (projectData) => {
  return apiClient.post('/projects/', projectData);
};

export const updateProject = (id, projectData) => {
  return apiClient.put(`/projects/${id}/`, projectData);
};

export const deleteProject = (id) => {
  return apiClient.delete(`/projects/${id}/`);
};

export const getMyProjects = () => {
  return apiClient.get('/projects/my/');
};
