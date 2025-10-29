<script setup>
import NavBar from '@/components/layout/NavBar.vue';
import Hero from '@/components/landing/Hero.vue';
import Features from '@/components/landing/Features.vue';
import About from '@/components/landing/About.vue';
import CTA from '@/components/landing/CTA.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div>
    <NavBar />
    <main>
      <Hero />
      <Features />
      <About />
      <CTA />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
/* Adicione estilos específicos para a Home.vue se necessário */
main > section {
  padding: 4rem 0;
}
</style>
