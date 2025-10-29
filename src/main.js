import { createApp } from 'vue'
import App from './App.vue'

// Plugins
import { createPinia } from 'pinia'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Global Styles
import './styles/global.css'

// --- Instâncias ---
const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
})

// --- Uso dos Plugins ---
app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')