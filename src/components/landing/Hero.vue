<template>
  <section id="hero" :style="heroStyle" class="relative d-flex align-center justify-center text-center">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div class="background-image"></div>
      <div class="overlay"></div>
    </div>
    
    <!-- Content -->
    <v-container class="relative z-10 px-4 py-10">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <h1 class="text-h2 text-md-h1 font-weight-bold mb-4">
            <span class="d-block mb-2">Guarani</span>
            <span class="text-gradient">O Futuro Sustentável</span>
          </h1>
          <p class="text-lg md:text-xl mx-auto mb-10" style="max-width: 720px;">
            A primeira plataforma brasileira de compra e venda de créditos de
            carbono da Amazônia, conectando empresas conscientes com projetos de
            preservação.
          </p>
          
          <div class="d-flex flex-column flex-sm-row gap-4 justify-center align-center">
            <v-btn size="large" color="primary" class="hero-btn">
              Começar Agora
              <v-icon class="ml-2">mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn size="large" variant="outlined" class="hero-btn">
              Saiba Mais
            </v-btn>
          </div>
          
          <!-- Stats -->
          <v-row class="mt-16" justify="center">
            <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="4">
              <div class="stat-card">
                <div class="text-h4 font-weight-bold text-primary mb-2">{{ stat.value }}</div>
                <div class="text-body-1">{{ stat.label }}</div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import heroImage from '@/assets/PlanodefundoArvore.png';

const stats = [
  { value: '500+', label: 'Toneladas de CO₂ Compensadas' },
  { value: '50+', label: 'Projetos Ativos' },
  { value: '1000+', label: 'Hectares Preservados' },
];

// Pass the image URL to CSS via a custom property
const heroStyle = {
  '--hero-background-image': `url(${heroImage})`
};
</script>

<style scoped>
#hero {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

.background-image {
  position: absolute;
  inset: 0;
  background-image: var(--hero-background-image);
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8), #FFF);
  z-index: 2;
}

/* Dark theme overlay */
.v-theme--dark .overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8), #000);
}

.z-10 {
  z-index: 10;
}

.text-gradient {
  background: linear-gradient(135deg, #4CAF50, #81C784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Fallback for browsers that don't support background-clip */
  color: #4CAF50;
}

.hero-btn {
  min-width: 180px;
}

.hero-btn .v-icon {
  transition: transform 0.2s ease-in-out;
}

.hero-btn:hover .v-icon {
  transform: translateX(4px);
}

.stat-card {
  padding: 24px;
  border-radius: 16px;
  background-color: rgba(var(--v-theme-surface), 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-border-color), 0.5);
  height: 100%;
}

.gap-4 {
  gap: 16px;
}
</style>