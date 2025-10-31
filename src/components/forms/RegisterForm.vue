<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

// O router passa 'userType' como uma prop.
const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['comprador', 'ofertante'].includes(value),
  },
});

const router = useRouter();

const loading = ref(false);
const error = ref(null);

// Reatividade para os campos do formulário
const formData = ref({
  contact_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  // Campos específicos
  organization_name: '', // para ofertante
  cnpj: '', // para ofertante
  contact_position: '', // para ofertante
  phone: '', // para ofertante
  organization_type: '', // para ofertante
  projectInterests: '', // para comprador
});

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

  // Simplificamos o payload para alinhar com o schema UserRegistration do backend
  // que requer apenas: email, password, user_type
  const userTypeUpper = props.userType.toUpperCase();
  const payload = {
    email: formData.value.email,
    password: formData.value.password,
    user_type: userTypeUpper,
  };

  console.log(`Tentando registrar novo ${props.userType} com:`, payload);

  try {
  const response = await register(payload);
    console.log('✅ Registro bem-sucedido! Resposta da API:', response.data);

    // Após o sucesso, redirecionar para o login
    router.push(`/login/${props.userType}`);
  } catch (err) {
    console.error('❌ Erro no registro:', err.response?.data || err.message);

    // Função para encontrar a primeira mensagem de erro, mesmo que esteja aninhada
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
  router.push(`/login/${props.userType}`);
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