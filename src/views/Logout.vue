<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
  auth.logout();
  router.replace('/');
});
</script>

<template>
  <div>
    <NavBar />
    <v-container class="py-16 text-center">
      <v-progress-circular indeterminate color="primary" size="40" class="mb-4"/>
      <div class="text-subtitle-1">Saindo...</div>
    </v-container>
    <Footer />
  </div>
</template>

<style scoped>
</style>
