<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
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
const route = useRoute();
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
    const credentials = { email: formData.value.email, password: formData.value.password };

    const ok = await authStore.login(credentials);
    if (ok) {
      const redirect = route.query.redirect || '/';
      router.push(redirect);
    }

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
                />

                <v-text-field
                  v-model="formData.password"
                  label="Senha"
                  type="password"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  required
                />

                <v-checkbox
                  v-model="formData.rememberMe"
                  label="Lembrar de mim"
                  color="primary"
                />

                <v-alert v-if="error" type="error" density="compact" class="mt-2 mb-4">
                  {{ error }}
                </v-alert>

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  class="mt-4"
                  :loading="loading"
                >
                  Entrar
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-actions class="justify-center mt-4">
              <span class="text-body-2">Não tem uma conta?</span>
              <v-btn variant="text" color="primary" @click="goToRegister">
                Registre-se
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