<template>
  <v-container>
    <v-card v-if="project">
      <v-card-title class="text-h4">{{ project.title }}</v-card-title>
      <v-card-text>
        <p class="text-body-1 mb-4">{{ project.description }}</p>
        <v-row>
          <v-col cols="12" md="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>ID do Projeto</v-list-item-title>
                <v-list-item-subtitle>{{ project.id }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="statusColor(project.status)" dark>{{ project.status }}</v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Orçamento</v-list-item-title>
                <v-list-item-subtitle>{{ project.budget }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" md="6">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Data de Início</v-list-item-title>
                <v-list-item-subtitle>{{ project.start_date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Data de Término</v-list-item-title>
                <v-list-item-subtitle>{{ project.end_date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="approveProject">Aprovar</v-btn>
        <v-btn color="error" @click="rejectProject">Rejeitar</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProjectById, updateProject } from '@/api/projects';

const route = useRoute();
const project = ref(null);

const fetchProject = async () => {
  try {
    const response = await getProjectById(route.params.id);
    project.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar detalhes do projeto:', error);
  }
};

onMounted(fetchProject);

const approveProject = async () => {
  try {
    await updateProject(project.value.id, { status: 'approved' });
    // Optionally, you can show a success message and navigate back to the admin page
  } catch (error) {
    console.error('Erro ao aprovar o projeto:', error);
  }
};

const rejectProject = async () => {
  try {
    await updateProject(project.value.id, { status: 'rejected' });
    // Optionally, you can show a success message and navigate back to the admin page
  } catch (error) {
    console.error('Erro ao rejeitar o projeto:', error);
  }
};

const statusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'yellow-darken-3';
    case 'approved':
      return 'green-darken-3';
    case 'rejected':
      return 'red-darken-3';
    default:
      return 'grey-darken-3';
  }
};
</script>

<style scoped>
</style>
