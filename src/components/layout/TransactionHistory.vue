<template>
  <v-card class="history-card pa-4 mb-6">
    <div class="text-subtitle-1 mb-2">Histórico de Transações</div>
    <div class="table-wrapper">
      <v-data-table
        :items="transactions"
        :headers="headers"
        dense
        item-key="id"
        class="elevation-0 themed-table"
      >
        <template #item.amount="{ item }">
          <span :class="item.type === 'deposit' ? 'deposit' : 'withdraw'">
            {{ item.type === 'deposit' ? '+' : '-' }} R$ {{ item.amount.toFixed(2) }}
          </span>
        </template>
        <template #no-data>
          <div class="text-caption pa-4 info-text">Nenhuma transação encontrada.</div>
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>
<script setup>

const mockTransactions = [
  { id: 1, date: '2025-10-29', type: 'deposit', amount: 1500.00, description: 'Salário' },
  { id: 2, date: '2025-10-28', type: 'withdraw', amount: 200.00, description: 'Supermercado' },
  { id: 3, date: '2025-10-27', type: 'deposit', amount: 300.00, description: 'Freelance' },
  { id: 4, date: '2025-10-26', type: 'withdraw', amount: 100.00, description: 'Cinema' },
];

const props = defineProps({ transactions: Array });

const transactions = props.transactions && props.transactions.length ? props.transactions : mockTransactions;

const headers = [
  { text: 'Data', value: 'date' },
  { text: 'Tipo', value: 'type' },
  { text: 'Valor', value: 'amount' },
  { text: 'Descrição', value: 'description' },
];
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
</style>