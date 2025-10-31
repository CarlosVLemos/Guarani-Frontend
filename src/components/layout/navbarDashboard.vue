<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLeaf } from '@mdi/js';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton.vue';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue';

const authStore = useAuthStore();
const { isDark, loadThemePreference } = useTheme();
const router = useRouter();

const scrolled = ref(false);
const drawer = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
  drawer.value = false;
};

const navigateTo = (path) => {
  router.push(path);
  drawer.value = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  loadThemePreference();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <v-app-bar
    app
    elevation="1"
    color="surface"
    class="navbar-container"
  >
    <v-container fluid class="d-flex align-center justify-space-between px-4">
      <!-- Logo -->
      <div class="d-flex align-center">
        <div class="logo-background mr-3">
          <svg-icon type="mdi" :path="mdiLeaf" class="leaf-icon" />
        </div>
        <v-toolbar-title class="brand-name">Guarani Dashboard</v-toolbar-title>
      </div>
      
      <!-- Ações Desktop -->
      <div class="d-none d-md-flex align-center">
        <template v-if="authStore.user">
          <div class="user-info mr-4">
            <v-avatar size="32" v-if="authStore.user.avatar">
              <img :src="authStore.user.avatar" alt="avatar" />
            </v-avatar>
            <span class="user-name">{{ authStore.user.name || authStore.user.email }}</span>
          </div>
          <v-btn class="btn btn--primary mr-3" rounded elevation="2" to="/projects">Meus Projetos</v-btn>
          <v-btn class="btn btn--primary-variant mr-3 text-white" rounded elevation="2" to="/create-project">Criar Projeto</v-btn>
          <v-btn variant="outlined" class="btn btn--secondary ml-3" @click="handleLogout">Sair</v-btn>
        </template>
        <ThemeToggleButton class="ml-4" />
      </div>

      <!-- Ícone do Menu Mobile -->
      <v-app-bar-nav-icon 
        class="d-md-none mobile-menu-icon" 
        @click.stop="drawer = !drawer"
      />
    </v-container>
  </v-app-bar>

  <!-- Drawer Mobile -->
  <MobileNavDrawer 
    v-model="drawer" 
    :auth-store="authStore"
    :is-dark="isDark"
    @navigate-to="navigateTo"
    @logout="handleLogout"
    dashboard
  />
</template>

<style scoped>
.navbar-container {
  backdrop-filter: blur(10px);
  background: #00BAB4 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important; 
  transition: background 0.3s;
  z-index: 2000;
}
.navbar-container.scrolled {
  background: #008B87 !important;
  box-shadow: 0 4px 20px rgba(0, 186, 180, 0.3) !important;
}
.logo-background {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00E5D0, #00BAB4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.logo-background:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 25px rgba(0, 186, 180, 0.4);
}
.leaf-icon {
  color: #fff;
  font-size: 24px;
}
.brand-name {
  background: linear-gradient(135deg, #ffffff, #e0f7f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.5px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-name {
  color: #fff;
  font-weight: 500;
  font-size: 16px;
}
.btn--primary {
  background: linear-gradient(135deg, #00E5D0, #00CFC7) !important;
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 229, 208, 0.3);
}
.btn--primary:hover {
  background: linear-gradient(135deg, #00FFF0, #00E5D0) !important;
  box-shadow: 0 4px 12px rgba(0, 229, 208, 0.5);
}
.btn--secondary {
  border-color: rgba(255, 255, 255, 0.6) !important;
  color: white !important;
  font-weight: 500;
}
.btn--secondary:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-color: white !important;
}
.mobile-menu-icon {
  color: white !important;
}
.mobile-menu-icon:hover {
  transform: rotate(90deg);
  color: #00E5D0 !important;
}
@media (max-width: 960px) {
  .brand-name { font-size: 20px; }
  .logo-background { width: 36px; height: 36px; }
  .leaf-icon { font-size: 20px; }
}
</style>