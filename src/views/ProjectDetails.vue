<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="project" class="bg-white shadow-md rounded-lg p-8">
      <h1 class="text-4xl font-bold mb-6">{{ project.title }}</h1>
      <p class="text-gray-700 text-lg mb-8">{{ project.description }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Detalhes do Projeto</h2>
          <ul class="space-y-2">
            <li><strong>ID do Projeto:</strong> {{ project.id }}</li>
            <li><strong>Status:</strong> <span class="text-yellow-500 font-semibold">{{ project.status }}</span></li>
            <li><strong>Orçamento:</strong> {{ project.budget }}</li>
            <li><strong>Data de Início:</strong> {{ project.startDate }}</li>
            <li><strong>Data de Término:</strong> {{ project.endDate }}</li>
          </ul>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-4">Organização</h2>
          <div class="flex items-center">
            <img :src="project.organization.logo" alt="Logo da Organização" class="w-16 h-16 rounded-full mr-4">
            <div>
              <h3 class="text-xl font-medium">{{ project.organization.name }}</h3>
              <p class="text-gray-600">{{ project.organization.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-4">Ações</h2>
        <div class="flex space-x-4">
          <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">Aprovar Projeto</button>
          <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg">Rejeitar Projeto</button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-16">
      <p>Carregando detalhes do projeto...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetails',
  data() {
    return {
      project: null,
    };
  },
  created() {
    // Simula a busca de dados do projeto com base no ID da rota
    const projectId = this.$route.params.id;
    // Em um aplicativo real, você faria uma chamada de API aqui
    this.project = {
      id: projectId,
      title: 'Projeto de Reflorestamento na Amazônia',
      description: 'Este projeto visa restaurar uma área degradada da Floresta Amazônica através do plantio de 1 milhão de árvores de espécies nativas. A iniciativa também inclui programas de educação ambiental para a comunidade local e monitoramento da fauna e flora da região.',
      status: 'Pendente',
      budget: 'R$ 500.000,00',
      startDate: '01/01/2024',
      endDate: '31/12/2025',
      organization: {
        name: 'Amazônia Viva',
        location: 'Manaus, AM',
        logo: 'https://via.placeholder.com/150',
      },
    };
  },
};
</script>

<style scoped>
</style>
