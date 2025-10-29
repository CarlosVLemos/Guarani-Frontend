// src/composables/useTheme.js
import { computed } from 'vue';
import { useTheme as useVuetifyTheme } from 'vuetify';

export function useTheme() {
  const theme = useVuetifyTheme();

  const isDark = computed(() => theme.global.name.value === 'myDarkTheme');

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'myLightTheme' : 'myDarkTheme';
    theme.global.name.value = newTheme;
    localStorage.setItem('theme-preference', newTheme);

    // Esta parte depende de uma função global, o que não é ideal.
    // No futuro, podemos refatorar isso para usar um sistema de eventos ou uma store.
    if (window.syncThemeWithCSS) {
      window.syncThemeWithCSS(newTheme, theme.themes.value[newTheme]);
    }
  };

  const loadThemePreference = () => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && ['myLightTheme', 'myDarkTheme'].includes(savedTheme)) {
      theme.global.name.value = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.global.name.value = prefersDark ? 'myDarkTheme' : 'myLightTheme';
    }
  };

  return {
    isDark,
    toggleTheme,
    loadThemePreference,
    theme: theme.global.name, // Exportando o nome do tema reativo se necessário
  };
}
