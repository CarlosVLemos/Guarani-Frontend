<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';

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
  organization_name: '',
  phone: '',
  // Campos específicos do Ofertante (não usados no registro inicial)
  contact_name: '',
  cnpj: '',
  contact_position: '',
  organization_type: '',
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

  const userTypeUpper = props.userType.toUpperCase();
  
  // Payload alinhado com a API: /api/users/register/
  const payload = {
    email: formData.value.email,
    password: formData.value.password,
    user_type: userTypeUpper,
    organization_name: formData.value.organization_name,
    phone: formData.value.phone,
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
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center">
            <span class="text-h5 font-weight-bold">{{ formTitle }}</span>
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Crie sua conta como {{ userType === 'comprador' ? 'Comprador' : 'Ofertante' }} para acessar a plataforma.
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <!-- Campos Comuns -->
              <v-text-field
                v-model="formData.email"
                label="E-mail"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.confirmPassword"
                label="Confirmar Senha"
                type="password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.organization_name"
                label="Nome da Organização/Empresa"
                prepend-inner-icon="mdi-domain"
                variant="outlined"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.phone"
                label="Telefone"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                required
              ></v-text-field>

              <v-divider v-if="userType === 'ofertante'" class="my-4"></v-divider>

              <!-- Campos Condicionais para Ofertante (Extras) -->
              <template v-if="userType === 'ofertante'">
                 <v-text-field
                  v-model="formData.contact_name"
                  label="Nome do Contato"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-model="formData.cnpj"
                  label="CNPJ"
                  prepend-inner-icon="mdi-card-account-details"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-model="formData.contact_position"
                  label="Cargo do Contato"
                  prepend-inner-icon="mdi-briefcase"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-model="formData.organization_type"
                  label="Tipo de Organização"
                  prepend-inner-icon="mdi-office-building"
                  variant="outlined"
                ></v-text-field>
              </template>

              <!-- Exibição de Erro -->
              <v-alert v-if="error" type="error" density="compact" class="mt-4 mb-2">
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                class="mt-6"
                :disabled="loading"
              >
                <v-progress-circular v-if="loading" indeterminate size="24" class="mr-2" />
                Registrar
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center mt-4">
            <span class="text-body-2">Já tem uma conta?</span>
            <v-btn text color="primary" @click="goToLogin">
              Faça Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
  background-color: var(--v-theme-surface);
}
.v-card {
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--v-theme-primary) 20%, transparent);
}
</style>