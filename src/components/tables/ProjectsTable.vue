<template>
  <v-card class="projects-card pa-4">
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="text-subtitle-1">Meus Projetos</div>
      <div class="text-caption">Total: {{ projects.length }}</div>
    </div>
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

</script>
<style scoped>
.projects-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
}
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.themed-table >>> .v-data-table__wrapper {
  background: transparent;
}
.action-btn {
  background: linear-gradient(135deg, #00E5D0, #00CFC7);
  color: #fff !important;
  border-radius: 50%;
  margin: 0 7px;
  transition: box-shadow 0.2s;
  width: 36px;
  height: 36px;
}
.action-btn:hover {
  box-shadow: 0 2px 8px rgba(0, 229, 208, 0.18);
  background-color: linear-gradient(135deg, #00CFC7, #00E5D0);
}
.info-text {
  color: #00CFC7;
}
</style>