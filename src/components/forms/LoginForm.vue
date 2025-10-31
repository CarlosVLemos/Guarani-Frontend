<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await authStore.login(formData.value);
    console.log('✅ Login bem-sucedido! Navegando para a home.');
    router.push('/');
  } catch (err) {
    console.error('❌ Erro no login:', err);
    error.value = 'E-mail ou senha inválidos. Tente novamente.';
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'Register' });
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-center text-h5 font-weight-bold mb-4">
            Login
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

              <v-alert v-if="error" type="error" density="compact" class="mt-2 mb-4">
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                class="mt-4"
                :loading="loading"
                :disabled="loading"
              >
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