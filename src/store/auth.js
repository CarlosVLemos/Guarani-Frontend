import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from '@/api/auth';
import { getUserById } from '@/api/users';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null);

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
      const accessToken = response.data.access;
      if (accessToken) {
        token.value = accessToken;
        localStorage.setItem('authToken', accessToken);
        await fetchUser(); // Busca os dados do usuário após o login
      } else {
        throw new Error('Token de acesso não recebido.');
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
  if (token.value) {
    fetchUser();
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
});
