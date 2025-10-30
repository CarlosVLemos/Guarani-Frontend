<template>
  <NavbarDashboard />
  <v-container fluid class="dashboard-container py-6">
    <div class="d-flex align-center justify-space-between mb-6 dashboard-header">
      <div>
        <h2 class="text-h5 mb-1 dashboard-title">Dashboard</h2>
        <div class="text-caption dashboard-subtitle">Visão geral da sua conta</div>
      </div>
      <div class="actions-container">
        <v-btn class="action-btn" color="primary" elevation="2" @click="goCreateProject">
          <v-icon left>mdi-plus</v-icon> Criar Projeto
        </v-btn>
        <v-btn class="action-btn" variant="outlined" color="secondary" @click="openDeposit">
          <v-icon left>mdi-cash-plus</v-icon> Depositar
        </v-btn>
      </div>
    </div>
    <WalletSummary :wallet="wallet" />
    <ProjectsTable :projects="projects" :headers="headers" @open="openProject" @edit="editProject" />
    <DepositDialog v-model="depositDialog" @deposit="confirmDeposit" />
  </v-container>
  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/layout/Footer.vue';
import WalletSummary from '@/components/layout/WalletSummary.vue';
import ProjectsTable from '@/components/tables/ProjectsTable.vue';
import DepositDialog from '@/components/dialogs/DepositDialog.vue';
import NavbarDashboard from '@/components/layout/NavbarDashboard.vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const wallet = computed(() => authStore.wallet || { saldo: 0, totalComprado: 0, totalGasto: 0 });
const router = useRouter();
const goCreateProject = () => router.push('/create-project');

const projects = ref([
  { id: 1, title: 'Projeto A', status: 'Publicado', budget: 1200 },
  { id: 2, title: 'Projeto B', status: 'Rascunho', budget: 0 },
  { id: 3, title: 'Projeto Conservação', status: 'Publicado', budget: 5000 },
]);

const headers = [
  { text: 'Título', value: 'title' },
  { text: 'Status', value: 'status' },
  { text: 'Orçamento (R$)', value: 'budget' },
  { text: 'Ações', value: 'actions', sortable: false },
];

const depositDialog = ref(false);
const depositAmount = ref(null);

const openDeposit = () => {
  depositAmount.value = null;
  depositDialog.value = true;
};

const confirmDeposit = (amount) => {
  if (amount <= 0) {
    alert('Informe um valor válido.');
    return;
  }
  if (typeof authStore.updateWallet === 'function') {
    const newSaldo = (authStore.wallet?.saldo || 0) + amount;
    authStore.updateWallet({ saldo: newSaldo });
  }
  depositDialog.value = false;
};

const openProject = (item) => router.push(`/projects/${item.id}`);
const editProject = (item) => router.push(`/projects/${item.id}/edit`);
</script>

<style scoped>
.dashboard-container {
  background: linear-gradient(135deg, #f8fffe 0%, #e6fcfa 100%);
  border-radius: 24px;
  box-shadow: 0 2px 24px rgba(0, 229, 208, 0.08);
  min-height: 80vh;
}
.dashboard-header {
  padding: 12px 0;
}
.dashboard-title {
  color: #004d4a;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.dashboard-subtitle {
  color: #00CFC7;
  font-weight: 500;
}
.actions-container {
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: stretch;
}
.action-btn {
  width: 100%;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 229, 208, 0.10);
  transition: box-shadow 0.2s;
}
.action-btn:hover {
  box-shadow: 0 4px 16px rgba(0, 229, 208, 0.18);
}
@media (min-width: 960px) {
  .actions-container { flex-direction: row; align-items: center; }
  .action-btn { width: auto; }
}
.table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
</style>