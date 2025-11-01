import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin } from '@/api/auth';
import { getMe } from '@/api/users';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null);
  const wallet = ref(JSON.parse(localStorage.getItem('authWallet')) || {
    balance: 0,
    total_purchased: 0,
    total_spent: 0,
  });

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Actions
  async function fetchUser() {
    if (!token.value) {
      console.log("Nenhum token, pulando busca de usuário.");
      return;
    }
    try {
      console.log("Buscando dados do usuário com getMe()...");
      const response = await getMe();
      user.value = response.data;
      localStorage.setItem('authUser', JSON.stringify(user.value));
      console.log("Usuário atualizado:", user.value);
    } catch (error) {
      console.error("Falha ao buscar dados do usuário com getMe():", error);
      // Se getMe() falhar (ex: token expirado), deslogar.
      logout();
      throw error;
    }
  }

  async function login(credentials) {
    try {
      const response = await apiLogin(credentials);
      const accessToken = response.data.access;

      if (!accessToken) {
        throw new Error("Token de acesso não recebido na resposta do login.");
      }

      token.value = accessToken;
      localStorage.setItem('authToken', accessToken);
      
      // Após o login, busca os dados do usuário.
      await fetchUser();

      return true;
    } catch (error) {
      console.error("Falha no login:", error);
      logout(); // Garante que o estado esteja limpo em caso de falha
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    wallet.value = { balance: 0, total_purchased: 0, total_spent: 0 };
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authWallet'); // Garante a limpeza do wallet
    console.log("Usuário deslogado e localStorage limpo.");
  }

  function updateWallet(newWalletData) {
    wallet.value = { ...wallet.value, ...newWalletData };
    localStorage.setItem('authWallet', JSON.stringify(wallet.value));
    console.log("Carteira atualizada:", wallet.value);
  }

  // Ao inicializar o store, se tiver um token, busca os dados do usuário.
  if (token.value) {
    fetchUser();
  }

  return {
    token,
    user,
    wallet,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    updateWallet,
  };
});
