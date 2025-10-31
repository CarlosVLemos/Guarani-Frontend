<template>
  <div>
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
  </div>
</template>

<script setup>
defineProps({
  user: Object,
  requirements: Object,
  documents: Array
});
</script>