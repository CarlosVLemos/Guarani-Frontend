import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin } from '../api/auth';
import { getMe } from '../api/users';

export const useAuthStore = defineStore('auth', () => {

  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null); 
  const isAuthenticated = computed(() => !!token.value);
  /**
   * Chama a API de login e salva o token se for bem-sucedido.
   * @param {object} credentials - { email, password }
   */
  async function login(credentials) {
    try {
      const response = await apiLogin(credentials);
      const accessToken = response.data.access;
      if (accessToken) {
        token.value = accessToken;
        localStorage.setItem('authToken', accessToken);
        // fetch current user info
        try {
          const me = await getMe();
          user.value = me.data;
          localStorage.setItem('authUser', JSON.stringify(user.value));
        } catch (e) {
          console.error('Falha ao carregar dados do usuário atual:', e);
          user.value = { email: credentials.email };
          localStorage.setItem('authUser', JSON.stringify(user.value));
        }
        return true;
      }
    } catch (error) {
      console.error("Falha no login:", error);
      logout(); 
      throw error; 
    }
  }

  /**
   * Limpa o token e os dados do usuário do estado e do localStorage.
   */
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  };
});
