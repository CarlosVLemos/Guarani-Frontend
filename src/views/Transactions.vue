<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';
import { getPublicTransactions } from '../api/marketplace';

const loading = ref(false);
const error = ref(null);
const transactions = ref([]);
const search = ref('');

const headers = [
  { title: 'Data', value: 'timestamp' },
  { title: 'Projeto', value: 'project_name' },
  { title: 'Comprador', value: 'buyer_email' },
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

// Busca local (frontend)
const filteredTransactions = computed(() => {
  if (!search.value) return transactions.value;
  const term = search.value.toLowerCase();
  return transactions.value.filter(t =>
    (t.project_name && t.project_name.toLowerCase().includes(term)) ||
    (t.buyer_email && t.buyer_email.toLowerCase().includes(term))
  );
});

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await getPublicTransactions();
    transactions.value = data.results ?? [];

    console.log('Transações públicas carregadas:', transactions.value);
  } catch (e) {
    error.value = 'Erro ao carregar transações.';
    console.error(e);
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <div>
    <NavBar />
    <v-container class="py-8">
      <h1 class="text-h5 font-weight-bold mb-4">Transações Públicas</h1>
      <v-text-field
        v-model="search"
        label="Buscar por projeto ou comprador"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
        hide-details
      />
      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-card v-else class="pa-4">
        <div v-if="!filteredTransactions.length" class="text-caption pa-4 info-text">
          Nenhuma transação encontrada.
        </div>
        <v-data-table
          v-else
          :items="filteredTransactions"
          :headers="headers"
          dense
          item-key="id"
          class="elevation-0"
          :items-per-page="10"
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
      </v-card>
    </v-container>
    <Footer />
  </div>
</template>

<style scoped>
.info-text {
  color: #00CFC7;
}
.truncate-text {
  display: inline-block;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>