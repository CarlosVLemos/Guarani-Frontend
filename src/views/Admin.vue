<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Painel de Administração</h1>

    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-6">Projetos Pendentes</h2>

      <div v-if="pendingProjects.length === 0" class="text-gray-500">
        Não há projetos pendentes no momento.
      </div>

      <div v-else>
        <ul>
          <li v-for="project in pendingProjects" :key="project.id" class="border-b py-4 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-medium">{{ project.title }}</h3>
              <p class="text-gray-600">{{ project.description }}</p>
            </div>
            <router-link :to="{ name: 'ProjectDetails', params: { id: project.id } }" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Ver Detalhes
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data() {
    return {
      pendingProjects: [
        {
          id: 1,
          title: 'Projeto de Reflorestamento na Amazônia',
          description: 'Um projeto para plantar 1 milhão de árvores na floresta amazônica.',
        },
        {
          id: 2,
          title: 'Construção de um Centro Comunitário',
          description: 'Um projeto para construir um centro comunitário para a comunidade local.',
        },
        {
          id: 3,
          title: 'Campanha de Limpeza de Praia',
          description: 'Uma campanha para limpar as praias da cidade.',
        },
      ],
    };
  },
};
</script>

<style scoped>
</style>
