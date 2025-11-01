<template>
  <v-card class="projects-card pa-4">
    <div class="table-wrapper">
      <div v-if="!projects || projects.length === 0" class="text-caption pa-4 info-text">
        Nenhum projeto encontrado.
      </div>
      <v-data-table
        v-else
        :items="projects"
        :headers="headers"
        dense
        item-key="id"
        class="elevation-0 themed-table"
      >
        <template #item.actions="{ item }" >
          <v-btn icon small class="action-btn" @click="$emit('open', item)">
            <v-icon >mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn icon small class="action-btn" @click="$emit('edit', item)">
            <v-icon >mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>
<script setup>

const props = defineProps({
  projects: Array,
  headers: Array,
});

const projects = props.projects;
const headers = props.headers;

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatAmount(value) {
  const v = Number(value) || 0;
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

</script>
<style scoped>
.projects-card {
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 229, 208, 0.10);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
  padding: 8px 8px !important; /* menos espaço interno */
  max-width: 900px; /* limita largura */
  margin: 0 auto;   /* centraliza */
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  max-height: 320px; /* limita altura da tabela */
  -webkit-overflow-scrolling: touch;
}
.themed-table >>> .v-data-table__wrapper {
  background: transparent;
}
.v-data-table td, .v-data-table th {
  padding: 2px 6px !important; /* menos espaço nas células */
  font-size: 12px;
  min-height: 20px; /* diminui altura mínima */
}
.action-btn {
  width: 24px;
  height: 24px;
  font-size: 16px;
  margin: 0 2px;
}
.text-subtitle-1 {
  font-size: 14px;
}
.text-caption {
  font-size: 11px;
}
.info-text {
  color: #00CFC7;
}
</style>