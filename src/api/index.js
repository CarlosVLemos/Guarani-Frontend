import axios from 'axios';
import { useAuthStore } from '../store/auth'; // 1. Importar a store

// A URL base da sua API. É uma boa prática guardá-la em variáveis de ambiente.
// Você pode criar um arquivo .env na raiz do projeto frontend com a linha:
// VITE_API_URL=http://localhost:8000/api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usando interceptors para adicionar o token de autenticação em cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token; // 2. Pegar o token diretamente da store
    console.log("Token adicionado no cabeçalho:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
