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
      </v-data-table>
    </div>
  </v-card>
</template>
<script setup>
const props = defineProps({ transactions: Array });

const transactions = props.transactions;

const headers = [
  { title: 'Data', value: 'date' },
  { title: 'Tipo', value: 'type' },
  { title: 'Valor', value: 'amount' },
  { title: 'Descrição', value: 'description' },
];

function formatAmount(value) {
  const v = Number(value) || 0;
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

.v-data-table-header,
.v-data-table thead {
  background: transparent !important;
  color: #004d4a !important;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid #00E5D0;
  z-index: 1;
}
</style>