<template>
  <div class="dashboard-wrapper">
    <NavbarDashboard />
    <v-container fluid class="dashboard-container">
      <div class="d-flex align-center justify-space-between mb-6 dashboard-header">
        <div>
          <h2 class="text-h5 mb-1 dashboard-title">Dashboard</h2>
          <div class="text-caption dashboard-subtitle">
            Visão geral da sua conta
            <span v-if="user.user_type === 'comprador'"> (Comprador)</span>
            <span v-else> (Ofertante)</span>
          </div>
        </div>
        <div class="actions-container">
          <v-btn v-if="user.user_type === 'ofertante'" class="action-btn" color="primary" elevation="2" @click="goCreateProject">
            <v-icon left>mdi-plus</v-icon> Criar Projeto
          </v-btn>
          <v-btn class="action-btn" variant="outlined" color="secondary" @click="openDeposit">
            <v-icon left>mdi-cash-plus</v-icon> Depositar
          </v-btn>
        </div>
      </div>
      <UserProfile :user="user" class="mb-6" />
      <WalletSummary :wallet="wallet" />
      <WalletChart :data="chartData" class="mb-6" />

      <!-- Projetos do ofertante ou projetos comprados pelo comprador -->
      <ProjectsTable v-if="projects.length" :projects="projects" :headers="headers" @open="openProject" @edit="editProject" />

      <!-- Histórico de transações -->
      <TransactionHistory :transactions="transactions" class="mt-6" />

      <!-- Exibir dados extras conforme tipo -->
      <div v-if="user.user_type === 'comprador'">
        <h3 class="mt-8 mb-2">Metas e Preferências</h3>
        <div v-if="requirements">
          <p>Meta de carbono: {{ requirements.meta_carbono }}</p>
          <p>Orçamento: R$ {{ requirements.orcamento }}</p>
          <p>Preferências: {{ requirements.preferencias }}</p>
        </div>
        <h3 class="mt-8 mb-2">Documentos de Sustentabilidade</h3>
        <ul>
          <li v-for="doc in documents" :key="doc.id">{{ doc.tipo }} - {{ doc.nome }}</li>
        </ul>
      </div>
      <div v-else>
        <h3 class="mt-8 mb-2">Documentos do Ofertante</h3>
        <ul>
          <li v-for="doc in documents" :key="doc.id">{{ doc.tipo }} - {{ doc.nome }}</li>
        </ul>
      </div>

      <DepositDialog v-model="depositDialog" @deposit="confirmDeposit" />
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '@/components/layout/Footer.vue';
import WalletSummary from '@/components/layout/WalletSummary.vue';
import ProjectsTable from '@/components/tables/ProjectsTable.vue';
import DepositDialog from '@/components/dialogs/DepositDialog.vue';
import NavbarDashboard from '@/components/layout/NavbarDashboard.vue';
import UserProfile from '@/components/layout/UserProfile.vue';
import WalletChart from '@/components/layout/WalletChart.vue';
import TransactionHistory from '@/components/layout/TransactionHistory.vue';
import { useAuthStore } from '@/store/auth';

// APIs
import { getProjects } from '@/api/projects';
import { getCompradorProfiles, getCompradorRequirements, getCompradorDocuments } from '@/api/comprador';
import { getOfertanteProfiles, getOfertanteDocuments } from '@/api/ofertante';
import { getTransactions } from '@/api/marketplace';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user || { name: 'Usuário', email: 'user@email.com', role: 'ofertante', user_type: 'ofertante' });
const wallet = computed(() => authStore.wallet || { saldo: 12.90, totalComprado: 23.00, totalGasto: 200.50 });

const projects = ref([]);
const transactions = ref([]);
const profile = ref(null);
const requirements = ref(null);
const documents = ref([]);
const chartData = ref([]);

const headers = [
  { text: 'Título', value: 'title' },
  { text: 'Status', value: 'status' },
  { text: 'Orçamento (R$)', value: 'budget' },
  { text: 'Ações', value: 'actions', sortable: false },
];

const depositDialog = ref(false);

const goCreateProject = () => router.push('/create-project');
const openProject = (item) => router.push(`/projects/${item.id}`);
const editProject = (item) => router.push(`/projects/${item.id}/edit`);
const openDeposit = () => { depositDialog.value = true; };

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

// Carregar dados conforme tipo de usuário
onMounted(async () => {
  if (!user.value) return;

  if (user.value.user_type === 'comprador') {
    // Dados do comprador
    const [profileRes, reqRes, docRes, transRes] = await Promise.all([
      getCompradorProfiles({ user: user.value.id }),
      getCompradorRequirements({ user: user.value.id }),
      getCompradorDocuments({ user: user.value.id }),
      getTransactions({ buyer: user.value.id }),
    ]);
    profile.value = profileRes.data[0];
    requirements.value = reqRes.data[0];
    documents.value = docRes.data;
    transactions.value = transRes.data;
    // Projetos comprados podem ser extraídos das transações
    projects.value = transactions.value.map(t => t.project);
    chartData.value = transactions.value.map(t => ({
      date: t.date,
      value: t.total_price,
    }));
  } else if (user.value.user_type === 'ofertante') {
    // Dados do ofertante
    const [profileRes, docRes, projRes, transRes] = await Promise.all([
      getOfertanteProfiles({ user: user.value.id }),
      getOfertanteDocuments({ user: user.value.id }),
      getProjects({ ofertante: user.value.id }),
      getTransactions({ project__ofertante: user.value.id }),
    ]);
    profile.value = profileRes.data[0];
    documents.value = docRes.data;
    projects.value = projRes.data;
    transactions.value = transRes.data;
    chartData.value = transactions.value.map(t => ({
      date: t.date,
      value: t.total_price,
    }));
  }
});
</script>

<style scoped>
.dashboard-wrapper {
  padding-top: 10px; 
}

.dashboard-container {
  background: linear-gradient(135deg, #f8fffe 0%, #e6fcfa 100%);
  border-radius: 24px;
  box-shadow: 0 2px 24px rgba(0, 229, 208, 0.08);
  min-height: 80vh;
}

.dashboard-header {
  border-bottom: 1px solid #00E5D0;
  padding-bottom: 16px;
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
  .actions-container { 
    flex-direction: row; 
    align-items: center; 
  }
  .action-btn { 
    width: auto; 
  }
}

.table-wrapper { 
  width: 100%; 
  overflow-x: auto; 
  -webkit-overflow-scrolling: touch; 
}
</style>