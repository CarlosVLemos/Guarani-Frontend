<template>
  <div class="dashboard-wrapper">
    <Navbar />
    <v-container fluid class="dashboard-container">
      <!-- 🔄 Loading State -->
      <div v-if="loading" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="mt-4 text-caption">Carregando dados...</p>
      </div>

      <!-- ✅ Conteúdo quando carregado -->
      <template v-else-if="user">
        <div
          class="d-flex align-center justify-space-between mb-6 dashboard-header"
        >
          <div>
            <h2 class="text-h5 mb-1 dashboard-title">Dashboard</h2>
            <div class="text-caption dashboard-subtitle">
              Visão geral da sua conta
              <span v-if="user.user_type === 'COMPRADOR'"> (Comprador)</span>
              <span v-else-if="user.user_type === 'OFERTANTE'"> (Ofertante)</span>
            </div>
          </div>
          <div class="actions-container">
            <v-btn
              v-if="user.user_type === 'COMPRADOR'"
              class="action-btn"
              color="primary"
              elevation="2"
              @click="goCreateProject"
            >
              <v-icon left>mdi-plus</v-icon> Criar Projeto
            </v-btn>
            <v-btn
              class="action-btn"
              variant="outlined"
              color="secondary"
              @click="openDeposit"
            >
              <v-icon left>mdi-cash-plus</v-icon> Depositar
            </v-btn>
          </div>
        </div>

        <UserProfile :user="user" class="mb-6" />
        <WalletSummary :wallet="wallet" />

        <div class="dashboard-row">
          <WalletChart :data="chartData" />
          <TransactionHistory :transactions="transactions" />
        </div>

        <ProjectsTable v-if="user.user_type === OFERTANTE" :projects="projects" :headers="projectHeaders" />


        <UserExtras
          
          :user="user"
          :requirements="requirements"
          :documents="documents"
        />
      </template>

      <!-- ⚠️ Estado de erro -->
      <div v-else class="text-center py-16">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <p class="mt-4">Ocorreu um erro ao carregar os dados do dashboard.</p>
      </div>

      <DepositDialog v-model="depositDialog" @deposit="confirmDeposit" />
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Footer from "@/components/layout/Footer.vue";
import WalletSummary from "@/components/layout/WalletSummary.vue";
import ProjectsTable from "@/components/tables/ProjectsTable.vue";
import DepositDialog from "@/components/dialogs/DepositDialog.vue";
import Navbar from "@/components/layout/Navbar.vue";
import UserProfile from "@/components/layout/UserProfile.vue";
import WalletChart from "@/components/layout/WalletChart.vue";
import TransactionHistory from "@/components/layout/TransactionHistory.vue";
import UserExtras from "../components/layout/UserExtras.vue";
import { useAuthStore } from "@/store/auth";

// APIs
import { getProjects } from "@/api/projects";
import {
  getCompradorProfiles,
  getCompradorRequirements,
  getCompradorDocuments,
} from "@/api/comprador";
import { getOfertanteProfiles, getOfertanteDocuments } from "@/api/ofertante";
import { getTransactions } from "@/api/marketplace";
import { getMe } from "../api/users";
import { getMyProjects } from "@/api/projects";
import { createTransaction } from "@/api/marketplace";

const authStore = useAuthStore();
const router = useRouter();

// --- Use o authStore como fonte da verdade ---
const user = computed(() => authStore.user);

const loading = ref(true);
const projects = ref([]);
const transactions = ref([]);
const profile = ref(null);
const requirements = ref(null);
const documents = ref([]);
const chartData = ref([]);
const depositDialog = ref(false);

const wallet = computed(() => {
  // Lógica da wallet permanece a mesma
  const saldo = transactions.value.reduce(
    (acc, t) => acc + (t.type === "deposit" ? t.amount : -t.amount),
    0
  );
  const totalComprado = transactions.value
    .filter((t) => t.type === "deposit")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalGasto = transactions.value
    .filter((t) => t.type === "withdraw")
    .reduce((acc, t) => acc + t.amount, 0);
  return { saldo, totalComprado, totalGasto };
});

const projects = ref([]);
const transactions = ref([]);
const profile = ref(null);
const requirements = ref(null);
const documents = ref([]);
const chartData = ref([]);
const depositDialog = ref(false);
const loading = ref(true);

const projectHeaders = [
  { title: "Nome", value: "name" },
  { title: "Tipo", value: "project_type" },
  { title: "Status", value: "status" },
  { title: "Créditos Disponíveis", value: "carbon_credits_available" },
  { title: "Preço por Crédito", value: "price_per_credit" },
  { title: "Ofertante", value: "ofertante.organization_name" },
  { title: "Data de Criação", value: "created_at" },
  { title: "Ações", value: "actions", sortable: false },
];

const openDeposit = () => {
  depositDialog.value = true;
};

onMounted(async () => {
  try {
    loading.value = true;

    // 1️⃣ BUSCAR USUÁRIO PRIMEIRO
    const userResponse = await getMe();
    user.value = userResponse.data;
    console.log("Usuário carregado:", user.value);

    console.log(
      "Carregando dados do dashboard para o transition:",
      getTransactions({ user: user.value.id })
    );
    console.log(
      "carregando projetos:",
      getMyProjects({ ofertante: user.value.id })
    );
    // console.log(
    //   "carregando projetos:",
    //   getProjects({ ofertante: user.value.id })
    // );
    // console.log("carregando:", getCompradorDocuments({ user: user.value.id }));

    // 2️⃣ Agora sim verificar e buscar dados relacionados
    if (!user.value) {
      console.warn("Usuário não encontrado no mounted hook.");
      return;
    }

    if (user.value.user_type === "COMPRADOR") {
      // Dados do comprador
      const [transRes] = await Promise.all([
        getTransactions({ user: user.value.id }),
      ]);
      transactions.value = transRes?.data?.results || [];

      chartData.value = transactions.value.map((t) => ({
        date: t.timestamp,
        value: Number(t.total_price),
      }));
    } else if (user.value.user_type === "OFERTANTE") {
      // Dados do ofertante
      const [projRes, transRes] = await Promise.all([
        getMyProjects({ ofertante: user.value.id }),
        getTransactions({ project__ofertante: user.value.id }),
      ]);

      projects.value = projRes?.data?.results;
      transactions.value = transRes?.data?.results || [];
      chartData.value = transactions.value.map((t) => ({
        date: t.timestamp,
        value: Number(t.total_price),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  } finally {
    loading.value = false;
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
  border-bottom: 1px solid #00e5d0;
  padding-bottom: 16px;
}

.dashboard-title {
  color: #004d4a;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.dashboard-subtitle {
  color: #00cfc7;
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
  box-shadow: 0 2px 8px rgba(0, 229, 208, 0.1);
  transition: box-shadow 0.2s;
}

.action-btn:hover {
  box-shadow: 0 4px 16px rgba(0, 229, 208, 0.18);
}

.dashboard-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 2px;
  margin-bottom: 32px;
}

@media (max-width: 960px) {
  .dashboard-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
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
