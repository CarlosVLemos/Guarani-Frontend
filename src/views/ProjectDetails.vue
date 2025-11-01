<template>
  <div>
    <navbarDashboard />
    <v-container>
      <div v-if="loading" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">Carregando detalhes do projeto...</p>
      </div>

      <v-alert v-else-if="error" type="error" class="mt-6">
        {{ error }}
      </v-alert>

      <v-card v-else-if="project" class="mt-6" flat border>
        <!-- Cabeçalho com Nome e Status -->
        <v-card-title class="d-flex align-center flex-wrap">
          <span class="text-h4 font-weight-bold mr-4">{{ project.name }}</span>
          <v-chip :color="statusColor(project.status)" variant="flat" label>
            <v-icon start :icon="statusIcon(project.status)"></v-icon>
            {{ statusText(project.status) }}
          </v-chip>
        </v-card-title>
        <v-card-subtitle class="text-body-1">{{ project.location }}</v-card-subtitle>

        <v-divider class="my-4"></v-divider>

        <!-- Corpo com Detalhes -->
        <v-card-text>
          <p class="text-body-1 mb-6">{{ project.description }}</p>

          <v-row>
            <!-- Coluna da Esquerda: Detalhes Principais -->
            <v-col cols="12" md="7">
              <h3 class="text-h6 font-weight-medium mb-3">Informações Gerais</h3>
              <v-list lines="two">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Tipo de Projeto</v-list-item-title>
                  <v-list-item-subtitle>{{ project.project_type_display }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Proprietário</v-list-item-title>
                  <v-list-item-subtitle>{{ project.owner_name }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Coordenadas</v-list-item-title>
                  <v-list-item-subtitle>Latitude: {{ project.latitude }}, Longitude: {{ project.longitude }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>

            <!-- Coluna da Direita: Detalhes Financeiros -->
            <v-col cols="12" md="5">
              <h3 class="text-h6 font-weight-medium mb-3">Dados Financeiros</h3>
              <v-list lines="two">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Créditos Disponíveis</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">{{ project.carbon_credits_available }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Preço por Crédito</v-list-item-title>
                  <v-list-item-subtitle class="text-h6">R$ {{ project.price_per_credit }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="my-4"></v-divider>

        <!-- Seção de Documentos -->
        <v-card-text>
          <h3 class="text-h6 font-weight-medium mb-4">Documentos do Projeto</h3>
          <div v-if="project.documents && project.documents.length">
            <v-list lines="one" class="bg-transparent">
              <v-list-item
                v-for="doc in project.documents"
                :key="doc.id"
                @click="() => viewDocument(doc.file)"
                class="border rounded-lg mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-file-document-outline</v-icon>
                </template>
                <v-list-item-title>{{ doc.name || 'Documento sem nome' }}</v-list-item-title>
                <v-list-item-subtitle>Clique para visualizar</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
          <p v-else class="text-caption">Nenhum documento foi enviado para este projeto ainda.</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="isOwner" color="primary" variant="flat" @click="goToEditPage">
            <v-icon start>mdi-pencil</v-icon>
            Editar Projeto
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProjectById } from '@/api/projects';
import { useAuthStore } from '@/store/auth';
import navbarDashboard from '@/components/layout/navbarDashboard.vue';
import Footer from '@/components/layout/Footer.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const project = ref(null);
const loading = ref(true);
const error = ref(null);

const isOwner = computed(() => {
  if (!project.value || !authStore.user) return false;
  // Assumes the API returns `project.owner` as the owner's user ID
  return project.value.owner === authStore.user.id;
});

const statusMap = {
  PENDING: { text: 'Pendente de Análise', color: 'warning', icon: 'mdi-clock-outline' },
  APPROVED: { text: 'Aprovado', color: 'success', icon: 'mdi-check-circle-outline' },
  REJECTED: { text: 'Rejeitado', color: 'error', icon: 'mdi-close-circle-outline' },
};

const statusText = (status) => statusMap[status]?.text || 'Desconhecido';
const statusColor = (status) => statusMap[status]?.color || 'grey';
const statusIcon = (status) => statusMap[status]?.icon || 'mdi-help-circle-outline';

const fetchProjectDetails = async () => {
  loading.value = true;
  error.value = null;
  try {
    const projectId = route.params.id;
    const response = await getProjectById(projectId);
    project.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar detalhes do projeto:", err);
    error.value = "Não foi possível carregar os detalhes do projeto. Tente novamente mais tarde.";
  } finally {
    loading.value = false;
  }
};

const viewDocument = (docUrl) => {
  window.open(docUrl, '_blank');
};

const goToEditPage = () => {
  router.push({ name: 'EditProject', params: { id: project.value.id } });
};

onMounted(() => {
  fetchProjectDetails();
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
.v-list-item {
  transition: background-color 0.2s ease-in-out;
}
.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
</style>