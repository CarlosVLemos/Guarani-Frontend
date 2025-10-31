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

const mockData = [
  { date: '2025-10-26', value: 1200 },
  { date: '2025-10-27', value: 1500 },
  { date: '2025-10-28', value: 1300 },
  { date: '2025-10-29', value: 1600 },
]

const props = defineProps({ data: Array })

const chartSource = props.data && props.data.length ? props.data : mockData;

const chartData = computed(() => ({
  labels: chartSource.map(d => d.date),
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
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: rgba(0, 229, 208, 0.04);
  flex: 1;
}


</style>