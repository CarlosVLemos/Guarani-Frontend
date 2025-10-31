<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMe } from '@/api/users';
import { getProjects } from '@/api/projects';
import { getTransactions } from '@/api/marketplace';
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';
import UserProfile from '@/components/layout/UserProfile.vue';
import WalletSummary from '@/components/layout/WalletSummary.vue';
import TransactionHistory from '@/components/layout/TransactionHistory.vue';
import ProjectsTable from '@/components/tables/ProjectsTable.vue';

const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const error = ref(null);
const me = ref(auth.user || null);
const transactions = ref([]);
const projects = ref([]);

const wallet = computed(() => auth.wallet || { saldo: 0, totalComprado: 0, totalGasto: 0 });
const isComprador = computed(() => (me.value?.user_type || auth.user?.user_type) === 'comprador');
const isOfertante = computed(() => (me.value?.user_type || auth.user?.user_type) === 'ofertante');

const fetchMe = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await getMe();
    me.value = data;
    auth.user = data;
    localStorage.setItem('authUser', JSON.stringify(data));
  } catch (e) {
    if (e?.response?.status === 401) {
      router.push({ name: 'Login', params: { userType: 'comprador' }, query: { redirect: '/me' } });
    }
    error.value = 'Não foi possível carregar seus dados.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fetchDataByRole = async () => {
  if (!me.value) return;
  try {
    if (me.value.user_type === 'comprador') {
      const { data } = await getTransactions({ buyer: me.value.id });
      transactions.value = data || [];
      // Atualiza totais da carteira com base nas transações (aproximação)
      const totalComprado = transactions.value.reduce((sum, t) => sum + (Number(t.total_price) || 0), 0);
      auth.updateWallet({ totalComprado });
    } else if (me.value.user_type === 'ofertante') {
      const [projRes, transRes] = await Promise.all([
        getProjects({ ofertante: me.value.id }),
        getTransactions({ project__ofertante: me.value.id }),
      ]);
      projects.value = projRes.data || [];
      transactions.value = transRes.data || [];
      // Atualiza totais (aproximação)
      const totalGasto = transactions.value.reduce((sum, t) => sum + (Number(t.total_price) || 0), 0);
      auth.updateWallet({ totalGasto });
    }
  } catch (e) {
    console.error('Falha ao carregar dados adicionais:', e);
  }
};

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push({ name: 'Login', params: { userType: 'comprador' }, query: { redirect: '/me' } });
    return;
  }
  await fetchMe();
  await fetchDataByRole();
});
</script>

<template>
  <div>
    <NavBar />
    <main>
      <v-container class="py-8">
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-6">Meu Perfil</h1>

        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <template v-else>
          <!-- Card do usuário -->
          <UserProfile :user="{ ...me, role: me?.user_type }" class="mb-6" />

          <!-- Resumo da carteira -->
          <WalletSummary :wallet="wallet" />

          <div class="dashboard-row mt-4">
            <!-- Histórico de transações -->
            <TransactionHistory :transactions="transactions" />
          </div>

          <!-- Projetos apenas para ofertante -->
          <div v-if="isOfertante" class="mt-4">
            <ProjectsTable :projects="projects" />
          </div>
        </template>
      </v-container>
    </main>
    <Footer />
  </div>
  
</template>

<style scoped>
.dashboard-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 960px) {
  .dashboard-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
