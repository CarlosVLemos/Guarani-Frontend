<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// O router passa 'userType' como uma prop.
const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['comprador', 'ofertante'].includes(value),
  },
});

const router = useRouter();

// Reatividade para os campos do formulário
const formData = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  // Campos específicos
  companyName: '', // para ofertante
  cnpj: '',        // para ofertante
  projectInterests: '', // para comprador
});

const formTitle = computed(() => 
  props.userType === 'comprador' ? 'Registro de Comprador' : 'Registro de Ofertante'
);

const handleRegister = () => {
  console.log(`Registrando novo ${props.userType}:`, formData.value);
  // Aqui você chamaria sua API de registro
  // Ex: await authApi.register(formData.value, props.userType);
  
  // Após o sucesso, redirecionar para o login ou dashboard
  router.push(`/login/${props.userType}`);
};

const goToLogin = () => {
  router.push(`/login/${props.userType}`);
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
            Crie sua conta para acessar a plataforma.
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <!-- Campos Comuns -->
              <v-text-field
                v-model="formData.fullName"
                label="Nome Completo"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
              ></v-text-field>

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

              <v-divider class="my-4"></v-divider>

              <!-- Campos Condicionais para Ofertante -->
              <template v-if="userType === 'ofertante'">
                <v-text-field
                  v-model="formData.companyName"
                  label="Nome da Empresa"
                  prepend-inner-icon="mdi-domain"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  v-model="formData.cnpj"
                  label="CNPJ"
                  prepend-inner-icon="mdi-card-account-details"
                  variant="outlined"
                ></v-text-field>
              </template>

              <!-- Campos Condicionais para Comprador -->
              <template v-if="userType === 'comprador'">
                <v-textarea
                  v-model="formData.projectInterests"
                  label="Áreas de Interesse em Projetos de Carbono"
                  prepend-inner-icon="mdi-leaf"
                  variant="outlined"
                  rows="3"
                ></v-textarea>
              </template>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                class="mt-6"
              >
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