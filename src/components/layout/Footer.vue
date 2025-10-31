<template>
  <v-footer class="text-center d-flex flex-column ga-2 py-8 footer-container">
    <div class="d-flex ga-3 mb-2">
      <v-btn
        v-for="icon in icons"
        :key="icon"
        :icon="icon"
        density="comfortable"
        variant="text"
        class="social-icon"
      ></v-btn>
    </div>
    
    <v-divider class="my-3 footer-divider" thickness="2"></v-divider>
    
    <div class="text-body-2 font-weight-medium footer-text mb-2">
      Projeto criado e idealizado por Guarani Technologies TDAH.
    </div>
    <div >
      Participantes:
    </div>
    <div class="d-flex flex-column">
      <p>Carlos Lemos</p>
      <p>Cauê Tamirana</p>
      <p>Emanuelle Ferreira</p>
      <p>Pedro Coriolano</p>
    </div>
    
    <div class="text-caption footer-text-secondary">
      {{ new Date().getFullYear() }} — Conectando empresas com a preservação da Amazônia
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
</script>

<style scoped>
.footer-container {
  background: linear-gradient(180deg, #00BAB4 0%, #008B87 100%) !important;
  color: white !important;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

/* Ícones sociais */
:deep(.social-icon) {
  color: rgba(255, 255, 255, 0.962) !important;
  transition: all 0.3s ease;
}

:deep(.social-icon:hover) {
  color: #cdfbf7 !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-3px);
}

/* Divider */
.footer-divider {
  border-color: rgba(255, 255, 255, 0.3) !important;
  width: 100px;
  margin: 0 auto;
  opacity: 0.8;
}

/* Textos */
.footer-text {
  color: rgba(255, 255, 255, 0.95) !important;
  letter-spacing: 0.5px;
}

.footer-text-secondary {
  color: rgba(255, 255, 255, 0.75) !important;
  letter-spacing: 0.3px;
}

/* Efeito de brilho no hover dos ícones */
:deep(.social-icon::before) {
  transition: opacity 0.3s ease;
}

:deep(.social-icon:hover::before) {
  opacity: 0.15;
}
</style>