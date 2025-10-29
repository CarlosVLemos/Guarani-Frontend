<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLeaf, mdiChevronDown } from '@mdi/js';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useTheme } from '@/composables/useTheme';
import { navItems } from '@/config/navigation';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton.vue';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer.vue';

const { isDark, loadThemePreference } = useTheme();
const router = useRouter();

// Estado reativo
const scrolled = ref(false);
const drawer = ref(false); // Controla a visibilidade do drawer
const showLoginOptions = ref(false);
const showRegisterOptions = ref(false);

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
  }
  drawer.value = false;
};

const navigateTo = (path) => {
  router.push(path);
  showLoginOptions.value = false;
  showRegisterOptions.value = false;
  drawer.value = false;
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
    fixed
    app
    color="surface"
    class="navbar-container"
    :class="{ 'scrolled': scrolled }"
  >
    <v-container class="d-flex align-center justify-space-between px-4">
      <!-- Logo -->
      <div class="d-flex align-center">
        <div class="logo-background mr-3">
          <svg-icon type="mdi" :path="mdiLeaf" class="leaf-icon" />
        </div>
        <v-toolbar-title class="brand-name">CarbonTech</v-toolbar-title>
      </div>
      
      <!-- Menu de Navegação Desktop -->
      <div class="hidden-sm-and-down navigation-menu">
        <v-btn 
          v-for="item in navItems" 
          :key="item.label" 
          text 
          class="nav-link"
          :to="item.href.startsWith('/') ? item.href : undefined"
          @click="!item.href.startsWith('/') ? scrollTo(item.href.substring(1)) : undefined"
        >
          {{ item.label }}
        </v-btn>
      </div>
      
      <!-- Botões de Ação Desktop -->
      <div class="hidden-sm-and-down d-flex align-center">
        <template v-if="!authStore.user">
          <!-- Opções de Login -->
          <div class="auth-options">
            <v-btn 
              variant="outlined"
              class="btn btn--secondary mr-3"
              @click="showLoginOptions = !showLoginOptions; showRegisterOptions = false"
            >
              Login
              <svg-icon type="mdi" :path="mdiChevronDown" class="chevron-icon" :class="{'rotate': showLoginOptions}" />
            </v-btn>
            <transition name="expand">
              <div v-if="showLoginOptions" class="options-panel">
                <v-btn text @click="navigateTo('/login/comprador')">Login Comprador &gt;</v-btn>
                <v-btn text @click="navigateTo('/login/ofertante')">Login Ofertante &gt;</v-btn>
              </div>
            </transition>
          </div>

          <!-- Opções de Registro -->
          <div class="auth-options">
            <v-btn 
              class="btn btn--primary"
              rounded 
              elevation="2"
              @click="showRegisterOptions = !showRegisterOptions; showLoginOptions = false"
            >
              Registrar
              <svg-icon type="mdi" :path="mdiChevronDown" class="chevron-icon" :class="{'rotate': showRegisterOptions}" />
            </v-btn>
            <transition name="expand">
              <div v-if="showRegisterOptions" class="options-panel">
                <v-btn text @click="navigateTo('/register/comprador')">Registro Comprador &gt;</v-btn>
                <v-btn text @click="navigateTo('/register/ofertante')">Registro Ofertante &gt;</v-btn>
              </div>
            </transition>
          </div>
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
        class="hidden-md-and-up mobile-menu-icon" 
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
/* Estilos que permanecem na NavBar (Desktop) */
.navbar-container {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent) !important;
}

.navbar-container.scrolled {
  background: color-mix(in srgb, var(--color-background) 95%, transparent) !important;
  box-shadow: 0 4px 20px color-mix(in srgb, var(--brand-primary) 10%, transparent) !important;
}

/* Logo */
.logo-background {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
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
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.logo-background:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 25px color-mix(in srgb, var(--brand-primary) 30%, transparent);
}

.logo-background:hover::before {
  left: 100%;
}

.leaf-icon {
  color: var(--vt-c-white);
  font-size: 24px;
  transition: all 0.3s ease;
}

.brand-name {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

/* Opções de Autenticação Desktop */
.auth-options {
  position: relative;
  margin-left: 8px;
}

.options-panel {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10;
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 100px;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

/* Menu de Navegação Desktop */
.navigation-menu {
  display: flex;
  gap: 8px;
}

/* Ícone do Menu Mobile */
.mobile-menu-icon {
  color: var(--color-text);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-icon:hover {
  transform: rotate(90deg);
  color: var(--brand-primary);
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