<template>
  <v-card class="history-card pa-4 mb-6">
    <div class="text-subtitle-1 mb-2">Histórico de Transações</div>
    <div class="table-wrapper">
      <div v-if="!transactions || transactions.length === 0" class="text-caption pa-4 info-text">
        Nenhuma transação encontrada.
      </div>
      <v-data-table
        v-else
        :items="transactions"
        :headers="headers"
        dense
        item-key="id"
        class="elevation-0 themed-table"
        :items-per-page="5"
      >
        <template #item.timestamp="{ item }">
          {{ formatDate(item.timestamp) }}
        </template>
        <template #item.total_price="{ item }">
          R$ {{ formatAmount(item.total_price) }}
        </template>
        <template #item.project_name="{ item }">
          <span class="truncate-text" :title="item.project_name">
            {{ item.project_name }}
          </span>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({ transactions: Array });

const headers = [
  { title: 'Data', value: 'timestamp' },
  { title: 'Projeto', value: 'project_name' },
  { title: 'Quantidade', value: 'quantity' },
  { title: 'Preço por Crédito', value: 'price_per_credit_at_purchase' },
  { title: 'Valor Total', value: 'total_price' },
];

function formatAmount(value) {
  const v = Number(value) || 0;
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  const date = new Date(value);
  return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<style scoped>
.history-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 229, 208, 0.10);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
  padding: 12px 12px !important;
  overflow: auto;
}
.table-wrapper { width: 100%; overflow-x: auto; }
.info-text { color: #00CFC7; }
.v-data-table { font-size: 12px; }
.v-data-table td, .v-data-table th { padding: 3px 6px !important; min-height: 22px; }
.v-data-table-header,
.v-data-table thead {
  font-size: 12px;
  background: transparent !important;
  color: #004d4a !important;
  font-weight: 600;
  border-bottom: 1px solid #00E5D0;
  z-index: 1;
}
.truncate-text {
  display: inline-block;
  max-width: 160px; /* ajuste conforme necessário */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>