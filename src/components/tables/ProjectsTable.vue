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
  padding: 24px 24px;
  
  
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  /* Removido max-height para altura normal */
  -webkit-overflow-scrolling: touch;
}
.themed-table >>> .v-data-table__wrapper {
  background: transparent;
}
.v-data-table td, .v-data-table th {
  padding: 16px 16px !important;
  font-size: 16px;
  min-height: 48px;
}
.action-btn {
  width: 36px;
  height: 36px;
  font-size: 20px;
  margin: 0 8px;
}
.text-subtitle-1 {
  font-size: 18px;
}
.text-caption {
  font-size: 14px;
}
.info-text {
  color: #00CFC7;
}
</style>