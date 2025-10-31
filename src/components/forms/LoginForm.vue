<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/auth';

// O router passa 'userType' como uma prop.
const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['comprador', 'ofertante'].includes(value),
  },
});

const router = useRouter();
const authStore = useAuthStore();

// Reatividade para os campos do formulário
const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);
const error = ref(null);

const formTitle = computed(() => 
  props.userType === 'comprador' ? 'Login de Comprador' : 'Login de Ofertante'
);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  console.log(`Tentando login com:`, { email: formData.value.email });
  const credentials = { email: formData.value.email, password: formData.value.password };
  console.log(`Tentando login com:`, credentials);
  try {
    const credentials = { email: formData.value.email, password: formData.value.password };

    await authStore.login(credentials);

    router.push('/dashboard'); // Redireciona para o dashboard após o login

  } catch (err) {
    console.error('❌ Erro no login:', err.response?.data || err.message);
    error.value = 'E-mail ou senha inválidos. Tente novamente.';
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push(`/register/${props.userType}`);
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center text-h5 font-weight-bold mb-4">
            {{ formTitle }}
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Bem-vindo(a) de volta!
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
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

              <v-checkbox
                v-model="formData.rememberMe"
                label="Lembrar de mim"
                color="primary"
              ></v-checkbox>

              <!-- Exibição de Erro -->
              <v-alert v-if="error" type="error" density="compact" class="mt-2 mb-4">
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                class="mt-4"
              >
                <v-progress-circular v-if="loading" indeterminate size="24" class="mr-2" />
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center mt-4">
            <span class="text-body-2">Não tem uma conta?</span>
            <v-btn text color="primary" @click="goToRegister">
              Registre-se
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