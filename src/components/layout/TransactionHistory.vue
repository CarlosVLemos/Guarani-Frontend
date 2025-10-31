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
      >
        <template #item.amount="{ item }">
          <span :class="item.type === 'deposit' ? 'deposit' : 'withdraw'">
            {{ item.type === 'deposit' ? '+' : '-' }}
            R$
            {{ formatAmount(item.amount) }}
          </span>
        </template>
        <template #item.timestamp="{ item }">
          {{ formatDate(item.timestamp) }}
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>
<script setup>
const props = defineProps({ transactions: Array });

const transactions = props.transactions;

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
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
}
.deposit { color: #00CFC7; font-weight: 600; }
.withdraw { color: #e53935; font-weight: 600; }
.table-wrapper { width: 100%; overflow-x: auto; }
.info-text { color: #00CFC7; }

.v-data-table {
  font-size: 13px;
}

.v-data-table td, .v-data-table th {
  padding: 4px 8px !important;
  min-height: 28px;
}

.v-data-table-header,
.v-data-table thead {
  font-size: 13px;
  background: transparent !important;
  color: #004d4a !important;
  font-weight: 600;
  border-bottom: 1px solid #00E5D0;
  z-index: 1;
}
</style>