<template>
  <v-row class="mb-6" dense>
    <v-col cols="12" md="4">
      <v-card class="wallet-card pa-4">
        <div class="text-caption card-label">Saldo disponível</div>
        <div class="text-h4 font-weight-bold card-value">R$ {{ formatted(wallet.saldo) }}</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="wallet-card pa-4">
        <div class="text-caption card-label">Total comprado</div>
        <div class="text-h6 card-value">R$ {{ formatted(wallet.totalComprado) }}</div>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="wallet-card pa-4">
        <div class="text-caption card-label">Total gasto</div>
        <div class="text-h6 card-value">R$ {{ formatted(wallet.totalGasto) }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
defineProps({ wallet: Object });
const formatted = (value) => {
  const v = Number(value) || 0;
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>
<style scoped>
.wallet-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: linear-gradient(135deg, #00E5D0 0%, #00CFC7 100%);
  color: #004d4a;
  transition: box-shadow 0.2s;
}
.wallet-card:hover {
  box-shadow: 0 4px 24px rgba(0, 229, 208, 0.18);
}
.card-label {
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 6px;
}
.card-value {
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 229, 208, 0.18);
}
</style>