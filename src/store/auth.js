import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from '@/api/auth';
import { getMe } from '../api/users';
import { getUserById } from '@/api/users';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null);
  const isAuthResolved = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function fetchUser() {
    if (!token.value) return;
    try {
      const decoded = jwtDecode(token.value);
      const userId = decoded.user_id;
      if (userId) {
        const response = await getUserById(userId);
        user.value = response.data;
        localStorage.setItem('authUser', JSON.stringify(user.value));
      } else {
        throw new Error('ID do usuário não encontrado no token.');
      }
    } catch (error) {
      console.error("Falha ao buscar dados do usuário:", error);
      logout(); // Desloga se o token for inválido ou o usuário não for encontrado
      throw error;
    }
  }

  async function login(credentials) {
    try {
      const response = await apiLogin(credentials);
      console.log("Resposta do login:", response);
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      if (accessToken) {
        token.value = accessToken;
        localStorage.setItem('authToken', accessToken);
        // fetch current user info
        const me = await getMe();
        user.value = me.data;
        localStorage.setItem('authUser', JSON.stringify(user.value));
        return true;
      }
    } catch (error) {
      console.error("Falha no login:", error);
      logout();
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }

  // Tenta buscar o usuário se um token existir no carregamento da página
  const initialAuthPromise = token.value ? fetchUser() : Promise.resolve();

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    initialAuthPromise, // Exporta a promessa diretamente
  };
});
