<script setup>
import { ref } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLeaf, mdiChevronDown, mdiAccountCircle } from '@mdi/js';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton.vue';

// Props para receber dados do componente pai (NavBar)
const props = defineProps({
  navItems: {
    type: Array,
    required: true,
  },
  authStore: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    required: true,
  },
});

// Emits para comunicar ações para o componente pai
const emit = defineEmits(['scrollTo', 'navigateTo', 'logout']);

// Estado local para os menus expansíveis do mobile
const showLoginOptions = ref(false);
const showRegisterOptions = ref(false);

// Funções que emitem eventos para o pai
const handleScrollTo = (id) => {
  emit('scrollTo', id);
};

const handleNavigateTo = (path) => {
  emit('navigateTo', path);
};

const handleLogout = () => {
  emit('logout');
};
</script>

<template>
  <v-navigation-drawer
    app
    temporary
    right
    class="mobile-drawer"
  >
    <v-list class="mobile-list">
      <!-- Header -->
      <v-list-item class="drawer-header px-4 py-6">
        <div class="d-flex align-center">
          <div class="logo-background-small mr-3">
            <svg-icon 
              type="mdi" 
              :path="mdiLeaf" 
              class="leaf-icon-small"
            />
          </div>
          <span class="brand-name-small">CarbonTech</span>
        </div>
      </v-list-item>
      
      <v-divider class="mb-4" />
      
      <!-- Itens de Navegação -->
      <v-list-item 
        v-for="item in navItems" 
        :key="item.label" 
        @click="item.href.startsWith('/') ? handleNavigateTo(item.href) : handleScrollTo(item.href.substring(1))"
        class="mobile-nav-item"
      >
        <v-list-item-title class="nav-link">
          {{ item.label }}
        </v-list-item-title>
      </v-list-item>
      
      <v-divider class="my-4" />
      
      <!-- Botões de Ação (Usuário Deslogado) -->
      <!-- Seção do Usuário Logado -->
      <div v-if="authStore.isAuthenticated" class="px-4">
        <v-list-item class="user-info-item" v-if="authStore.user">
            <template v-slot:prepend>
              <v-avatar color="grey-darken-1" class="mr-4">
                <v-img v-if="authStore.user.profile_picture" :src="authStore.user.profile_picture" :alt="authStore.user.full_name"></v-img>
                <svg-icon v-else type="mdi" :path="mdiAccountCircle" size="32" />
              </v-avatar>
            </template>
            <v-list-item-title class="font-weight-bold">{{ authStore.user.full_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user.email }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider class="my-4" />
      </div>

  <div v-if="!authStore.isAuthenticated">
        <v-list-item class="px-4">
          <v-btn 
            variant="outlined"
            block 
            class="btn btn--secondary mb-3"
            @click="showLoginOptions = !showLoginOptions; showRegisterOptions = false"
          >
            Login
            <svg-icon type="mdi" :path="mdiChevronDown" class="chevron-icon" :class="{'rotate': showLoginOptions}" />
          </v-btn>
          <transition name="expand">
            <div v-if="showLoginOptions" class="mobile-options-panel">
              <v-btn text block @click="handleNavigateTo('/login/comprador')">Login Comprador &gt;</v-btn>
              <v-btn text block @click="handleNavigateTo('/login/ofertante')">Login Ofertante &gt;</v-btn>
            </div>
          </transition>
        </v-list-item>
        
        <v-list-item class="px-4">
          <v-btn 
            block 
            class="btn btn--primary" 
            @click="showRegisterOptions = !showRegisterOptions; showLoginOptions = false"
          >
            Registrar
            <svg-icon type="mdi" :path="mdiChevronDown" class="chevron-icon" :class="{'rotate': showRegisterOptions}" />
          </v-btn>
          <transition name="expand">
            <div v-if="showRegisterOptions" class="mobile-options-panel">
              <v-btn text block @click="handleNavigateTo('/register/comprador')">Registro Comprador &gt;</v-btn>
              <v-btn text block @click="handleNavigateTo('/register/ofertante')">Registro Ofertante &gt;</v-btn>
            </div>
          </transition>
        </v-list-item>
      </div>

      <!-- Botões de Ação (Usuário Logado) -->
  <div v-if="authStore.isAuthenticated" class="px-4">
        <!-- Você pode adicionar outros botões para usuários logados aqui, como "Meus Projetos" -->
        <!-- <v-btn block class="btn btn--primary mb-3" @click="handleNavigateTo('/projects')">Meus Projetos</v-btn> -->
        
        <v-list-item class="px-0">
          <v-btn block variant="outlined" class="btn btn--secondary" @click="handleLogout">Sair</v-btn>
        </v-list-item>
      </div>

      <!-- Botão de Tema -->
      <v-list-item class="px-4 mt-4">
        <ThemeToggleButton is-mobile />
      </v-list-item>
      
      <!-- Status do Tema -->
      <v-list-item class="px-4 mt-2">
        <div class="theme-status d-flex align-center justify-center">
          <div class="theme-dot" :class="{ 'active': isDark }"></div>
          <span class="text-caption ml-2">Tema {{ isDark ? 'Escuro' : 'Claro' }} Ativo</span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
/* --- Estilos do Menu Mobile --- */
.mobile-drawer {
  border-left: 3px solid var(--brand-primary) !important;
  background: var(--color-background) !important;
}

.mobile-list {
  background: var(--color-background);
}

.drawer-header {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--brand-primary) 10%, transparent),
    color-mix(in srgb, var(--brand-secondary) 5%, transparent)
  );
  border-radius: 0 0 16px 16px;
  margin-bottom: 8px;
}

.logo-background-small {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leaf-icon-small {
  color: var(--vt-c-white);
  font-size: 18px;
}

.brand-name-small {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 18px;
}

.mobile-nav-item {
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.mobile-nav-item:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  transform: translateX(8px);
}

.mobile-options-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-background) 90%, transparent);
  border-radius: 8px;
  margin-top: 8px;
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

.user-info-item .v-avatar {
  border: 2px solid var(--brand-primary);
}

/* --- Estilos do Status do Tema --- */
.theme-status {
  opacity: 0.7;
  font-size: 12px;
}

.theme-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-secondary);
  transition: all 0.3s ease;
}

.theme-dot.active {
  background: var(--brand-accent);
  box-shadow: 0 0 8px var(--brand-accent);
}
</style>