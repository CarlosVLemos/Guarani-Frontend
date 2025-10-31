<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
import { useTheme } from '@/composables/useTheme';

// Prop para diferenciar a versão mobile da desktop
defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <!-- Versão Desktop -->
  <div v-if="!isMobile" class="theme-toggle-wrapper">
    <div 
      class="theme-toggle-background"
      @click="toggleTheme"
      :title="isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'"
    >
      <svg-icon 
        type="mdi" 
        :path="isDark ? mdiWeatherSunny : mdiWeatherNight" 
        class="theme-icon"
        :class="{ 'sun-mode': !isDark, 'moon-mode': isDark }"
      />
    </div>
    <div class="theme-indicator" :class="{ 'dark-mode': isDark }"></div>
  </div>

  <!-- Versão Mobile -->
  <div v-else class="d-flex justify-center">
    <div 
      class="mobile-theme-toggle"
      @click="toggleTheme"
    >
      <svg-icon 
        type="mdi" 
        :path="isDark ? mdiWeatherSunny : mdiWeatherNight" 
        class="mobile-theme-icon"
        :class="{ 'sun-mode': !isDark, 'moon-mode': isDark }"
      />
      <span class="ml-3 text-primary-theme font-weight-medium">
        {{ isDark ? 'Modo Claro' : 'Modo Escuro' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* --- Estilos do Botão de Tema (Desktop) --- */
.theme-toggle-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.theme-toggle-background {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  box-shadow: 0 4px 15px color-mix(in srgb, var(--brand-primary) 25%, transparent);
}

.theme-toggle-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.theme-toggle-background:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 8px 25px color-mix(in srgb, var(--brand-primary) 35%, transparent);
}

.theme-toggle-background:hover::before {
  left: 100%;
}

.theme-icon {
  color: white;
  font-size: 22px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon.sun-mode {
  filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.6));
  animation: sunGlow 2s ease-in-out infinite alternate;
}

.theme-icon.moon-mode {
  filter: drop-shadow(0 0 8px rgba(156, 163, 175, 0.6));
  animation: moonGlow 3s ease-in-out infinite alternate;
}

@keyframes sunGlow {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(10deg) scale(1.05); }
}

@keyframes moonGlow {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(-5deg) scale(1.02); }
}

.theme-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--brand-secondary);
  margin-top: 2px;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.theme-indicator.dark-mode {
  background: var(--brand-accent);
  box-shadow: 0 0 8px var(--brand-accent);
}

/* --- Estilos do Botão de Tema (Mobile) --- */
.mobile-theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--brand-primary) 10%, transparent),
    color-mix(in srgb, var(--brand-secondary) 5%, transparent)
  );
  border: 2px solid color-mix(in srgb, var(--brand-primary) 30%, transparent);
  min-width: 200px;
}

.mobile-theme-toggle:hover {
  background: linear-gradient(135deg, 
    color-mix(in srgb, var(--brand-primary) 15%, transparent),
    color-mix(in srgb, var(--brand-secondary) 10%, transparent)
  );
  transform: scale(1.02);
  border-color: var(--brand-primary);
}

.mobile-theme-icon {
  font-size: 20px;
  color: var(--brand-primary);
  transition: all 0.3s ease;
}

.mobile-theme-icon.sun-mode {
  color: #FFA000;
  filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.4));
}

.mobile-theme-icon.moon-mode {
  color: #7C4DFF;
  filter: drop-shadow(0 0 4px rgba(124, 77, 255, 0.4));
}
</style>