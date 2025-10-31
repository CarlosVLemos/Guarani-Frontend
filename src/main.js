import { createApp } from 'vue'
import App from './App.vue'

// seus imports atuais
import { createPinia } from 'pinia'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './styles/global.css'

// n8n Chat
import '@n8n/chat/style.css'
import { createChat } from '@n8n/chat'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({ components, directives })

app.use(pinia)
app.use(router)
app.use(vuetify)

// 🌿 Chat global da Guarani
createChat({
  webhookUrl: 'https://n8n.coriolano.space/webhook/95b46349-def3-4011-91df-1ba072f0c52c/chat', // troque pelo seu webhook real
  mode: 'window',
  loadPreviousSession: true,
  showWelcomeScreen: true, // 👈 obriga clicar no botão antes de iniciar
  defaultLanguage: 'pt',
  initialMessages: [
    'Olá! 👋',
    'Eu sou o assistente da Guarani. Como posso te ajudar hoje?'
  ],
  i18n: {
    pt: {
      title: 'Bem-vindo(a) à Guarani 🌿',
      subtitle: 'Clique em “Começar” para iniciar o chat.',
      footer: '',
      getStarted: 'Começar',
      inputPlaceholder: 'Digite sua mensagem...',
    },
  },
  webhookConfig: {
    method: 'POST',
    headers: {}
  },
  metadata: { site: 'Guarani' },
  enableStreaming: true,
})

// monta o app normalmente
app.mount('#app')
