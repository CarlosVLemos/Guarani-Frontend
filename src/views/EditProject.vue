<template>
  <div>
    <NavBar />
    <v-container>
      <div v-if="loading" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">Carregando projeto para edição...</p>
      </div>

      <v-alert v-else-if="error" type="error" class="mt-6">
        {{ error }}
      </v-alert>

      <v-card v-else-if="project" class="pa-4 mt-6">
        <v-card-title class="text-h5 font-weight-bold mb-4">Editar Projeto</v-card-title>

        <!-- Formulário para Detalhes do Projeto -->
        <v-card-text>
          <h3 class="text-h6 font-weight-medium mb-4">Detalhes do Projeto</h3>
          <v-form @submit.prevent="submitProjectUpdate">
            <v-text-field v-model="project.name" label="Nome do Projeto" variant="outlined" :rules="[rules.required]"></v-text-field>
            <v-textarea v-model="project.description" label="Descrição" variant="outlined" :rules="[rules.required]" rows="4"></v-textarea>
            <v-select v-model="project.project_type" :items="projectTypeOptions" label="Tipo de Projeto" variant="outlined" :rules="[rules.required]"></v-select>
            <v-text-field v-model="project.location" label="Localização" variant="outlined" :rules="[rules.required]"></v-text-field>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="project.carbon_credits_available" label="Créditos de Carbono Disponíveis" type="number" variant="outlined" :rules="[rules.required, rules.positive]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="project.price_per_credit" label="Preço por Crédito (R$)" type="number" prefix="R$" variant="outlined" :rules="[rules.required, rules.positive]"></v-text-field>
              </v-col>
            </v-row>
            <v-alert v-if="updateError" type="error" class="mb-4">{{ updateError }}</v-alert>
            <v-btn type="submit" color="primary" block size="large" :loading="updating">Salvar Alterações</v-btn>
          </v-form>
        </v-card-text>

        <v-divider class="my-6"></v-divider>

        <!-- Seção Foto Principal -->
        <v-card-text>
          <h3 class="text-h6 font-weight-medium mb-4">Foto Principal do Projeto</h3>
          <p class="text-caption mb-4">Esta é a imagem que aparecerá nos cards e no topo da página de detalhes.</p>
          <v-file-input v-model="coverImageFile" label="Selecionar foto principal" variant="outlined" accept="image/*" show-size></v-file-input>
          <v-alert v-if="coverImageError" type="error" class="my-4">{{ coverImageError }}</v-alert>
          <v-btn @click="handleCoverImageUpload" color="secondary" :loading="coverImageUploading" :disabled="!coverImageFile">Atualizar Foto Principal</v-btn>
        </v-card-text>

        <v-divider class="my-6"></v-divider>

        <!-- Seção de Documentos -->
        <v-card-text>
          <h3 class="text-h6 font-weight-medium mb-4">Gerenciar Imagens/Documentos</h3>
          
          <h4 class="text-subtitle-1 font-weight-medium mb-2">Documentos Atuais</h4>
          <div v-if="project.documents && project.documents.length">
            <v-list lines="one" class="bg-transparent">
              <v-list-item v-for="doc in project.documents" :key="doc.id" :title="doc.name" class="border rounded-lg mb-2">
                 <template v-slot:prepend>
                  <v-icon>mdi-file-document-outline</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </div>
          <p v-else class="text-caption mb-4">Nenhum documento enviado.</p>

          <h4 class="text-subtitle-1 font-weight-medium mt-6 mb-2">Adicionar Novos Documentos</h4>
          <v-file-input v-model="filesToUpload" label="Selecionar novos arquivos" variant="outlined" multiple chips counter show-size></v-file-input>
          <v-alert v-if="uploadError" type="error" class="my-4">{{ uploadError }}</v-alert>
          <v-btn @click="handleUpload" color="secondary" :loading="uploading" :disabled="!filesToUpload.length">Enviar Novos Arquivos</v-btn>
        </v-card-text>

        <v-card-actions>
            <v-btn color="grey" block @click="finishEditing" class="mt-4">Voltar para o Projeto</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProjectById, updateProject, uploadProjectDocument, deleteProjectDocument } from '@/api/projects';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const route = useRoute();
const router = useRouter();

// Estado geral
const project = ref(null);
const loading = ref(true);
const error = ref(null);

// Estado do formulário de detalhes
const updating = ref(false);
const updateError = ref(null);

// Estado da foto principal
const coverImageFile = ref(null);
const coverImageUploading = ref(false);
const coverImageError = ref(null);

// Estado do formulário de upload
const filesToUpload = ref([]);
const uploading = ref(false);
const uploadError = ref(null);

const rules = {
  required: value => !!value || 'Este campo é obrigatório.',
  positive: value => value > 0 || 'O valor deve ser positivo.',
};

const projectTypeOptions = [
  { title: 'Reflorestamento e Conservação', value: 'REFLORESTAMENTO' },
  { title: 'Energia Renovável', value: 'ENERGIA_RENOVAVEL' },
  { title: 'Agricultura de Baixo Carbono', value: 'AGRICULTURA' },
  { title: 'Gestão de Resíduos', value: 'GESTAO_RESIDUOS' },
  { title: 'Outro', value: 'OUTRO' },
];

const fetchProject = async () => {
  loading.value = true;
  try {
    const projectId = route.params.id;
    const response = await getProjectById(projectId);
    project.value = response.data;
  } catch (err) {
    console.error("Erro ao carregar projeto:", err);
    error.value = "Falha ao carregar os dados do projeto para edição.";
  } finally {
    loading.value = false;
  }
};

const submitProjectUpdate = async () => {
  updating.value = true;
  updateError.value = null;
  try {
    const projectId = route.params.id;
    
    const projectDataToUpdate = {
      name: project.value.name,
      description: project.value.description,
      project_type: project.value.project_type,
      location: project.value.location,
      // A API pode esperar strings para campos numéricos, uma causa comum de erros 400.
      carbon_credits_available: String(project.value.carbon_credits_available),
      price_per_credit: String(project.value.price_per_credit),
    };

    await updateProject(projectId, projectDataToUpdate);
    alert('Projeto atualizado com sucesso!');
  } catch (err) {
    console.error("Erro detalhado ao atualizar projeto:", err.response ? err.response.data : err);
    updateError.value = "Ocorreu um erro ao salvar as alterações. Verifique os campos e tente novamente.";
  } finally {
    updating.value = false;
  }
};

const handleUpload = async () => {
  if (!filesToUpload.value.length) return;
  uploading.value = true;
  uploadError.value = null;

  const projectId = route.params.id;
  let successCount = 0;

  for (const file of filesToUpload.value) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    try {
      await uploadProjectDocument(projectId, formData);
      successCount++;
    } catch (err) {
      console.error(`Erro ao enviar o arquivo ${file.name}:`, err);
      uploadError.value = `Erro ao enviar o arquivo ${file.name}.`;
      uploading.value = false;
      return; // Para o processo se um arquivo falhar
    }
  }

  uploading.value = false;
  filesToUpload.value = [];
  alert(`${successCount} arquivo(s) enviado(s) com sucesso!`);
  // Recarrega os dados do projeto para mostrar os novos documentos
  await fetchProject(); 
};

const handleCoverImageUpload = async () => {
  if (!coverImageFile.value) return;
  coverImageUploading.value = true;
  coverImageError.value = null;

  const projectId = route.params.id;

  try {
    // Verifica se já existe uma foto principal e a deleta
    const mainPhoto = project.value.documents.find(doc => doc.name === '__main_photo__');
    if (mainPhoto) {
      await deleteProjectDocument(projectId, mainPhoto.id);
    }

    // Envia a nova foto principal
    const formData = new FormData();
    formData.append('name', '__main_photo__');
    formData.append('file', coverImageFile.value);

    await uploadProjectDocument(projectId, formData);
    
    alert('Foto principal atualizada com sucesso!');
    coverImageFile.value = null;
    await fetchProject(); // Recarrega os dados para refletir a mudança

  } catch (err) {
    console.error('Erro ao atualizar foto principal:', err);
    coverImageError.value = 'Ocorreu um erro ao atualizar a foto principal.';
  } finally {
    coverImageUploading.value = false;
  }
};

const finishEditing = () => {
  router.push({ name: 'ProjectDetails', params: { id: route.params.id } });
};

onMounted(() => {
  fetchProject();
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
