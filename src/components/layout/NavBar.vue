<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLeaf, mdiChevronDown } from '@mdi/js';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { navItems } from '@/config/navigation';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton.vue';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue';

const authStore = useAuthStore();
const { isDark, loadThemePreference } = useTheme();
const router = useRouter();

// Estado reativo
const scrolled = ref(false);
const drawer = ref(false); // Controla a visibilidade do drawer

// Métodos
const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
  drawer.value = false;
};

const scrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    console.log(`Scrolled to element with ID: ${elementId}`);
  }
  drawer.value = false;
};

const navigateTo = (path) => {
  router.push(path);
  drawer.value = false;

  console.log(`Navigated to path: ${path}`);
};

// Hooks do ciclo de vida
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
    elevation="0"
    color="surface"
    class="navbar-container"
    :class="{ 'scrolled': scrolled }"
  >
    <v-container fluid class="d-flex align-center justify-space-between px-4">
      <!-- Logo -->
      <div class="d-flex align-center">
        <div class="logo-background mr-3">
          <svg-icon type="mdi" :path="mdiLeaf" class="leaf-icon" />
        </div>
        <v-toolbar-title class="brand-name">Guarani</v-toolbar-title>
      </div>
      
      <!-- Menu de Navegação Desktop -->
      <div class="d-none d-md-flex navigation-menu">
        <v-btn 
          v-for="item in navItems" 
          :key="item.label" 
          variant="text" 
          class="nav-link"
          :to="item.href.startsWith('/') ? item.href : undefined"
          @click="!item.href.startsWith('/') ? scrollTo(item.href.substring(1)) : undefined"
        >
          {{ item.label }}
        </v-btn>
      </div>
      
      <!-- Botões de Ação Desktop -->
      <div class="d-none d-md-flex align-center">
        <template v-if="!authStore.user">

          <!-- Opções de Login com v-menu -->
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                class="btn btn--secondary mr-3"
                append-icon="mdi-chevron-down"
              >
                Login
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/login/comprador')">
                <v-list-item-title>Login Comprador &gt;</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo('/login/ofertante')">
                <v-list-item-title>Login Ofertante &gt;</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Opções de Registro com v-menu -->
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="btn btn--primary"
                rounded 
                elevation="2"
                append-icon="mdi-chevron-down"
              >
                Registrar
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/register/comprador')">
                <v-list-item-title>Registro Comprador &gt;</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo('/register/ofertante')">
                <v-list-item-title>Registro Ofertante &gt;</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </template>

        <template v-if="authStore.user">
          <v-btn class="btn btn--primary mr-3" rounded elevation="2" to="/projects">Meus Projetos</v-btn>
          <v-btn class="btn btn--primary-variant mr-3" rounded elevation="2" to="/create-project">Criar Projeto</v-btn>
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

  <!-- Componente do Drawer Mobile -->
  <MobileNavDrawer 
    v-model="drawer" 
    :nav-items="navItems"
    :auth-store="authStore"
    :is-dark="isDark"
    @scroll-to="scrollTo"
    @navigate-to="navigateTo"
    @logout="handleLogout"
  />
</template>

<style scoped>
.navbar-container {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #00BAB4 !important; /* Turquesa vibrante */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  z-index: 2000; 
  overflow: visible !important;
}

.navbar-container.scrolled {
  background: #008B87 !important; /* Turquesa mais escuro ao rolar */
  box-shadow: 0 4px 20px rgba(0, 186, 180, 0.3) !important;
}

/* Logo e brand name */
.logo-background {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00E5D0, #00BAB4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.logo-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.logo-background:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 25px rgba(0, 186, 180, 0.4);
}

.logo-background:hover::before {
  left: 100%;
}

.leaf-icon {
  color: #ffffff;
  font-size: 24px;
  transition: all 0.3s ease;
}

.brand-name {
  background: linear-gradient(135deg, #ffffff, #e0f7f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

/* Menu de Navegação Desktop */
.navigation-menu {
  display: flex;
  gap: 8px;
}

/* Links da navegação em branco */
:deep(.nav-link) {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 500;
}

:deep(.nav-link:hover) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

/* Botões ajustados */
:deep(.btn--secondary) {
  border-color: rgba(255, 255, 255, 0.6) !important;
  color: white !important;
  font-weight: 500;
}

:deep(.btn--secondary:hover) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-color: white !important;
}

:deep(.btn--primary) {
  background: linear-gradient(135deg, #00E5D0, #00CFC7) !important;
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 229, 208, 0.3);
}

:deep(.btn--primary:hover) {
  background: linear-gradient(135deg, #00FFF0, #00E5D0) !important;
  box-shadow: 0 4px 12px rgba(0, 229, 208, 0.5);
}

/* Ícone mobile */
.mobile-menu-icon {
  color: white !important;
}

.mobile-menu-icon:hover {
  transform: rotate(90deg);
  color: #00E5D0 !important;
}

/* Ajustes Responsivos */
@media (max-width: 960px) {
  .brand-name { font-size: 20px; }
  .logo-background { width: 36px; height: 36px; }
  .leaf-icon { font-size: 20px; }
}

.v-container { max-width: 1200px; }

* {
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-background, .nav-link {
  transition-property: all;
}
</style>