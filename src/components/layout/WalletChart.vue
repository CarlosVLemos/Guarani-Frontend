<template>
  <v-card class="chart-card pa-4 mb-6">
    <div class="text-subtitle-1 mb-2">Evolução do Saldo</div>
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { computed } from 'vue'
import { mdiResponsive } from '@mdi/js'
Chart.register(...registerables)


const props = defineProps({ data: Array })

const chartSource = props.data ;

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const chartData = computed(() => ({
  labels: chartSource.map(d => formatDate(d.date)),
  datasets: [{
    label: 'Saldo (R$)',
    data: chartSource.map(d => d.value),
    borderColor: '#00CFC7',
    backgroundColor: 'rgba(0,229,208,0.08)',
    tension: 0.3,
  }]
}))

const chartOptions = {
  mdiResponsive: true,
  scales: {
    x: { ticks: { color: '#00CFC7', font: { size: 11 } }, grid: { color: '#e0f7fa' } },
    y: { beginAtZero: true, ticks: { color: '#004d4a', font: { size: 11 } }, grid: { color: '#e0f7fa' } }
  }
}
</script>

<style scoped>

.chart-card {
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 229, 208, 0.10);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
  padding: 12px 16px !important;
  min-height: 220px;
  max-width: 480px;
  flex: 1;
}

.text-subtitle-1 {
  font-size: 15px;
  margin-bottom: 8px;
}

</style>