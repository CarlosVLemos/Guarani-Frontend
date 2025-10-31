<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['comprador', 'ofertante'].includes(value),
  },
});

const emit = defineEmits(['change-type']);

const router = useRouter();

const loading = ref(false);
const error = ref(null);

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  // Campos Ofertante obrigatórios
  contact_name: '',
  contact_position: '',
  phone: '',
  organization_type: '',
  organization_name: '',
  // Campos Ofertante opcionais
  cnpj: '',
  website: '',
  description: '',
});

const orgTypeItems = [
  { title: 'ONG', value: 'ONG' },
  { title: 'Empresa Privada', value: 'EMPRESA_PRIVADA' },
  { title: 'Cooperativa', value: 'COOPERATIVA' },
  { title: 'Projeto Independente', value: 'PROJETO_INDEPENDENTE' },
];

const formTitle = computed(() => 
  props.userType === 'comprador' ? 'Registro de Comprador' : 'Registro de Ofertante'
);

const handleRegister = async () => {
  loading.value = true;
  error.value = null;

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'As senhas não coincidem.';
    loading.value = false;
    return;
  }

  const userTypeUpper = props.userType.toUpperCase();

  // Validações específicas para ofertante
  if (props.userType === 'ofertante') {
    const missing = [];
    if (!formData.value.contact_name) missing.push('Nome do Contato');
    if (!formData.value.contact_position) missing.push('Cargo');
    if (!formData.value.phone) missing.push('Telefone');
    if (!formData.value.organization_type) missing.push('Tipo de Organização');
    if (!formData.value.organization_name) missing.push('Nome da Organização');
    if (missing.length) {
      error.value = `Preencha os campos obrigatórios: ${missing.join(', ')}.`;
      loading.value = false;
      return;
    }
  }

  // Monta o payload conforme regras
  const payload = props.userType === 'ofertante'
    ? {
        email: formData.value.email,
        password: formData.value.password,
        user_type: userTypeUpper,
        ofertante_profile: {
          contact_name: formData.value.contact_name,
          contact_position: formData.value.contact_position,
          phone: formData.value.phone,
          organization_type: formData.value.organization_type,
          organization_name: formData.value.organization_name,
          // opcionais, só envia se preenchidos
          ...(formData.value.cnpj ? { cnpj: formData.value.cnpj } : {}),
          ...(formData.value.website ? { website: formData.value.website } : {}),
          ...(formData.value.description ? { description: formData.value.description } : {}),
        },
      }
    : {
        email: formData.value.email,
        password: formData.value.password,
        user_type: userTypeUpper,
      };

  console.log(`Tentando registrar novo ${props.userType} com:`, payload);

  try {
  const response = await register(payload);
    console.log('✅ Registro bem-sucedido! Resposta da API:', response.data);
    router.push({ name: 'Login', query: { registered: 'true' } });
  } catch (err) {
    console.error('❌ Erro no registro:', err.response?.data || err.message);
    const findFirstError = (errors) => {
      if (!errors || typeof errors !== 'object') return null;
      const keys = Object.keys(errors);
      if (!keys.length) return null;
      const firstKey = keys[0];
      const firstValue = errors[firstKey];
      if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') return firstValue[0];
      return findFirstError(firstValue);
    };
    const responseData = err.response?.data;
    error.value = findFirstError(responseData) || 'Ocorreu um erro ao registrar. Verifique os dados e tente novamente.';
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'Login' });
}
</script>

<template>
  <div>
    <NavBar />
    <v-container class="fill-height page-wrap" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="elevation-12 pa-4">
            <v-card-title class="text-center text-h5 font-weight-bold mb-4">
              {{ formTitle }}
            </v-card-title>
            <v-card-subtitle class="text-center mb-6">
              Crie sua conta para acessar a plataforma.
            </v-card-subtitle>

            <v-card-text>
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="formData.email"
                  label="E-mail"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  required
                />

                <v-text-field
                  v-model="formData.password"
                  label="Senha"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  required
                />

                <v-text-field
                  v-model="formData.confirmPassword"
                  label="Confirmar Senha"
                  type="password"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  required
                />

                <v-select
                  :items="['comprador', 'ofertante']"
                  :model-value="props.userType"
                  label="Tipo de usuário"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  disabled
                />

                <!-- Campos para Ofertante -->
                <template v-if="props.userType === 'ofertante'">
                  <v-divider class="my-4" />
                  <v-text-field
                    v-model="formData.contact_name"
                    label="Nome do Contato"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.contact_position"
                    label="Cargo do Contato"
                    prepend-inner-icon="mdi-briefcase"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.phone"
                    label="Telefone"
                    prepend-inner-icon="mdi-phone"
                    variant="outlined"
                    required
                  />
                  <v-select
                    :items="orgTypeItems"
                    item-title="title"
                    item-value="value"
                    v-model="formData.organization_type"
                    label="Tipo de Organização"
                    prepend-inner-icon="mdi-office-building"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.organization_name"
                    label="Nome da Organização/Empresa"
                    prepend-inner-icon="mdi-domain"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.cnpj"
                    label="CNPJ (opcional)"
                    prepend-inner-icon="mdi-card-account-details"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="formData.website"
                    label="Website (opcional)"
                    prepend-inner-icon="mdi-web"
                    variant="outlined"
                  />
                  <v-textarea
                    v-model="formData.description"
                    label="Descrição (opcional)"
                    prepend-inner-icon="mdi-text"
                    variant="outlined"
                    rows="3"
                  />
                </template>

                <v-alert v-if="error" type="error" density="compact" class="mt-4 mb-2">
                  {{ error }}
                </v-alert>

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  class="mt-6"
                  :loading="loading"
                >
                  Registrar
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-center mt-4">
              <span class="text-body-2">Já tem uma conta?</span>
              <v-btn variant="text" color="primary" @click="goToLogin">
                Faça Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <Footer />
  </div>
</template>

<style scoped>
.page-wrap { min-height: calc(100vh - 64px - 240px); }
.v-card {
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--v-theme-primary) 20%, transparent);
}
</style>