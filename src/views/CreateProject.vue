<template>
  <div>
    <navbarDashboard />
    <v-container>
      <v-card class="pa-4 mt-6">
        <v-card-title class="text-h5 font-weight-bold mb-4">Criar Novo Projeto</v-card-title>
        
        <v-window v-model="step">
          <!-- Etapa 1: Detalhes do Projeto -->
          <v-window-item :value="1">
            <v-card-subtitle>Etapa 1 de 2: Detalhes do Projeto</v-card-subtitle>
            <v-card-text>
              <v-form @submit.prevent="submitProject">
                <v-text-field v-model="project.name" label="Nome do Projeto" variant="outlined" :rules="[rules.required]"></v-text-field>
                <v-textarea v-model="project.description" label="Descrição" variant="outlined" :rules="[rules.required]" rows="4"></v-textarea>
                <v-select v-model="project.project_type" :items="projectTypeOptions" label="Tipo de Projeto" variant="outlined" :rules="[rules.required]"></v-select>
                <v-text-field v-model="project.location" label="Localização (ex: Cidade, Estado)" variant="outlined" :rules="[rules.required]"></v-text-field>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model.number="project.latitude" label="Latitude" type="number" variant="outlined" :rules="[rules.required]"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model.number="project.longitude" label="Longitude" type="number" variant="outlined" :rules="[rules.required]"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model.number="project.carbon_credits_available" label="Créditos de Carbono Disponíveis" type="number" variant="outlined" :rules="[rules.required, rules.positive]"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model.number="project.price_per_credit" label="Preço por Crédito (R$)" type="number" prefix="R$" variant="outlined" :rules="[rules.required, rules.positive]"></v-text-field>
                  </v-col>
                </v-row>
                <v-alert v-if="errorStep1" type="error" class="mb-4">{{ errorStep1 }}</v-alert>
                <v-btn type="submit" color="primary" block size="large" :loading="loadingStep1">Avançar para Documentos</v-btn>
              </v-form>
            </v-card-text>
          </v-window-item>

          <!-- Etapa 2: Upload de Documentos -->
          <v-window-item :value="2">
            <v-card-subtitle>Etapa 2 de 2: Documentos do Projeto</v-card-subtitle>
            <v-card-text>
              <p class="mb-4">O projeto "{{ createdProject.name }}" foi criado. Agora, adicione os documentos necessários.</p>
              <v-file-input v-model="filesToUpload" label="Selecionar documentos" variant="outlined" multiple chips counter show-size></v-file-input>
              <v-alert v-if="errorStep2" type="error" class="my-4">{{ errorStep2 }}</v-alert>
              <v-btn @click="handleUpload" color="primary" :loading="loadingStep2" :disabled="!filesToUpload.length" class="mr-4">Enviar Documentos</v-btn>
              
              <v-divider class="my-6"></v-divider>

              <h4 class="text-h6 font-weight-medium">Documentos Enviados</h4>
              <v-list lines="one" v-if="uploadedFiles.length">
                <v-list-item v-for="(file, i) in uploadedFiles" :key="i" :title="file.name" :subtitle="`Tamanho: ${(file.size / 1024).toFixed(2)} KB`">
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <p v-else class="text-caption">Nenhum documento enviado ainda.</p>

              <v-btn color="grey" block size="large" class="mt-6" @click="finishCreation">Finalizar</v-btn>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createProject, uploadProjectDocument } from '@/api/projects';
import navbarDashboard from '@/components/layout/navbarDashboard.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const step = ref(1);

// --- Etapa 1 --- 
const project = ref({
  name: '',
  description: '',
  project_type: null,
  location: '',
  latitude: null,
  longitude: null,
  carbon_credits_available: null,
  price_per_credit: null,
});
const projectTypeOptions = [
  { title: 'Reflorestamento e Conservação', value: 'REFLORESTAMENTO' },
  { title: 'Energia Renovável', value: 'ENERGIA_RENOVAVEL' },
  { title: 'Agricultura de Baixo Carbono', value: 'AGRICULTURA' },
  { title: 'Gestão de Resíduos', value: 'GESTAO_RESIDUOS' },
  { title: 'Outro', value: 'OUTRO' },
];
const loadingStep1 = ref(false);
const errorStep1 = ref(null);
const createdProject = ref(null); // Armazena o projeto criado

const rules = {
  required: value => !!value || 'Este campo é obrigatório.',
  positive: value => value > 0 || 'O valor deve ser positivo.',
};

const submitProject = async () => {
  loadingStep1.value = true;
  errorStep1.value = null;
  try {
    const response = await createProject(project.value);
    createdProject.value = response.data;
    step.value = 2; // Avança para a próxima etapa
  } catch (err) {
    console.error('Erro na Etapa 1:', err.response?.data || err.message);
    errorStep1.value = 'Ocorreu um erro ao criar o projeto. Verifique os dados.';
  } finally {
    loadingStep1.value = false;
  }
};

// --- Etapa 2 --- 
const filesToUpload = ref([]);
const uploadedFiles = ref([]);
const loadingStep2 = ref(false);
const errorStep2 = ref(null);

const handleUpload = async () => {
  if (!filesToUpload.value.length) return;
  loadingStep2.value = true;
  errorStep2.value = null;

  const projectId = createdProject.value.id;

  // Faz o upload de cada arquivo individualmente
  for (const file of filesToUpload.value) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    try {
      await uploadProjectDocument(projectId, formData);
      uploadedFiles.value.push({ name: file.name, size: file.size });
    } catch (err) {
      console.error(`Erro ao enviar o arquivo ${file.name}:`, err.response?.data || err.message);
      errorStep2.value = `Erro ao enviar o arquivo ${file.name}. Tente novamente.`;
      // Para o loop se um arquivo falhar
      loadingStep2.value = false;
      return;
    }
  }

  filesToUpload.value = []; // Limpa a seleção de arquivos
  loadingStep2.value = false;
};

const finishCreation = () => {
  // Redireciona para a página de detalhes do projeto
  router.push({ name: 'ProjectDetails', params: { id: createdProject.value.id } });
};

</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>