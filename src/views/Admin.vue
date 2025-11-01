<template>
  <v-container>
    <h1 class="text-h4 mb-8">Painel de Administração</h1>

    <v-card>
      <v-card-title>
        Projetos Pendentes
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="project in pendingProjects"
            :key="project.id"
            :to="{ name: 'ProjectDetails', params: { id: project.id } }"
          >
            <v-list-item-content>
              <v-list-item-title>{{ project.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ project.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon>
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div v-if="pendingProjects.length === 0" class="text-center text-grey-darken-1">
          Não há projetos pendentes no momento.
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProjects } from '@/api/projects';

const pendingProjects = ref([]);

onMounted(async () => {
  try {
    const response = await getProjects({ status: 'pending' });
    pendingProjects.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar projetos pendentes:', error);
  }
});
</script>

<style scoped>
</style>
