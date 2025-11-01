<script setup>
import { ref, reactive, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const props = defineProps({
  userType: {
    type: String,
    required: true,
    validator: (value) => ['comprador', 'ofertante', 'auditor'].includes(value),
  },
});

const router = useRouter();

const loading = ref(false);
const error = ref(null);

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  user_type: '',
  ofertante_profile: {},
  comprador_profile: {},
  comprador_organization: {},
  auditor_profile: {},
});

// Reage às mudanças na prop e reinicializa o formulário
watchEffect(() => {
  const type = props.userType || 'ofertante';
  formData.user_type = type.toUpperCase();

  // Reseta todos os perfis
  formData.ofertante_profile = {};
  formData.comprador_profile = {};
  formData.comprador_organization = {};
  formData.auditor_profile = {};

  if (type === 'ofertante') {
    formData.ofertante_profile = {
      contact_name: '',
      contact_position: '',
      phone: '',
      organization_type: null,
      organization_name: '',
      cnpj: '',
      website: '',
      description: '',
    };
  } else if (type === 'comprador') {
    formData.comprador_profile = {
      contact_name: '',
      contact_position: '',
      department: '',
      phone: '',
      internal_code: '',
    };
    formData.comprador_organization = {
      company_name: '',
      cnpj: '',
      industry_sector: null,
      website: '',
    };
  } else if (type === 'auditor') {
    formData.auditor_profile = {
      contact_name: '',
      phone: '',
    };
  }
});

const formTitle = computed(() => {
  switch (props.userType) {
    case 'comprador': return 'Registro de Comprador';
    case 'ofertante': return 'Registro de Ofertante';
    case 'auditor': return 'Registro de Auditor';
    default: return 'Registro';
  }
});

const orgTypeItems = [
  { title: 'ONG', value: 'ONG' },
  { title: 'Empresa Privada', value: 'EMPRESA_PRIVADA' },
  { title: 'Cooperativa', value: 'COOPERATIVA' },
  { title: 'Projeto Independente', value: 'PROJETO_INDEPENDENTE' },
];
const industrySectorItems = [
  { title: 'Mineração', value: 'MINERACAO' },
  { title: 'Petróleo', value: 'PETROLEO' },
  { title: 'Siderurgia', value: 'SIDERURGIA' },
  { title: 'Bancário', value: 'BANCARIO' },
  { title: 'Manufatura', value: 'MANUFATURA' },
  { title: 'Outros', value: 'OUTROS' },
];

const handleRegister = async () => {
  loading.value = true;
  error.value = null;

  if (formData.password !== formData.confirmPassword) {
    error.value = 'As senhas não coincidem.';
    loading.value = false;
    return;
  }

  let payload = {
    email: formData.email,
    password: formData.password,
    user_type: formData.user_type,
  };

  if (props.userType === 'ofertante') {
    payload.ofertante_profile = formData.ofertante_profile;
  } else if (props.userType === 'comprador') {
    payload.comprador_profile = formData.comprador_profile;
    payload.comprador_organization = formData.comprador_organization;
  } else if (props.userType === 'auditor') {
    payload.auditor_profile = formData.auditor_profile;
  }

  try {
    await register(payload);
    router.push({ name: 'Login', query: { registered: 'true' } });
  } catch (err) {
    const responseData = err.response?.data;
    const findFirstError = (errors) => {
      if (!errors || typeof errors !== 'object') return 'Ocorreu um erro desconhecido.';
      const keys = Object.keys(errors);
      if (!keys.length) return 'Ocorreu um erro desconhecido.';
      const firstKey = keys[0];
      const firstValue = errors[firstKey];
      if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
        return `${firstKey}: ${firstValue[0]}`;
      }
      if (typeof firstValue === 'object') {
        return findFirstError(firstValue);
      }
      return 'Verifique os dados e tente novamente.';
    };
    error.value = findFirstError(responseData);
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
                <h3 class="text-subtitle-1 font-weight-medium mb-3">Dados de Acesso</h3>
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

                <!-- Campos para Ofertante -->
                <template v-if="props.userType === 'ofertante'">
                  <v-divider class="my-4" />
                  <h3 class="text-subtitle-1 font-weight-medium mb-3">Perfil do Ofertante</h3>
                  <v-text-field
                    v-model="formData.ofertante_profile.contact_name"
                    label="Nome do Contato"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.ofertante_profile.contact_position"
                    label="Cargo do Contato"
                    prepend-inner-icon="mdi-briefcase"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.ofertante_profile.phone"
                    label="Telefone"
                    prepend-inner-icon="mdi-phone"
                    variant="outlined"
                    required
                  />
                  <v-select
                    v-model="formData.ofertante_profile.organization_type"
                    :items="orgTypeItems"
                    label="Tipo de Organização"
                    prepend-inner-icon="mdi-office-building"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.ofertante_profile.organization_name"
                    label="Nome da Organização/Projeto"
                    prepend-inner-icon="mdi-domain"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.ofertante_profile.cnpj"
                    label="CNPJ (opcional)"
                    prepend-inner-icon="mdi-card-account-details"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="formData.ofertante_profile.website"
                    label="Website (opcional)"
                    prepend-inner-icon="mdi-web"
                    variant="outlined"
                  />
                  <v-textarea
                    v-model="formData.ofertante_profile.description"
                    label="Descrição da Organização (opcional)"
                    prepend-inner-icon="mdi-text"
                    variant="outlined"
                    rows="3"
                  />
                </template>

                <!-- Campos para Comprador -->
                <template v-if="props.userType === 'comprador'">
                  <v-divider class="my-4" />
                  <h3 class="text-subtitle-1 font-weight-medium mb-3">Perfil do Comprador</h3>
                  <v-text-field
                    v-model="formData.comprador_profile.contact_name"
                    label="Nome do Contato na Empresa"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.comprador_profile.contact_position"
                    label="Cargo do Contato"
                    prepend-inner-icon="mdi-briefcase"
                    variant="outlined"
                  />
                   <v-text-field
                    v-model="formData.comprador_profile.department"
                    label="Departamento"
                    prepend-inner-icon="mdi-door-open"
                    variant="outlined"
                  />
                  <v-text-field
                    v-model="formData.comprador_profile.phone"
                    label="Telefone do Contato"
                    prepend-inner-icon="mdi-phone"
                    variant="outlined"
                    required
                  />

                  <v-divider class="my-4" />
                  <h3 class="text-subtitle-1 font-weight-medium mb-3">Dados da Empresa</h3>
                  <v-text-field
                    v-model="formData.comprador_organization.company_name"
                    label="Nome da Empresa"
                    prepend-inner-icon="mdi-domain"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.comprador_organization.cnpj"
                    label="CNPJ da Empresa"
                    prepend-inner-icon="mdi-card-account-details"
                    variant="outlined"
                    required
                  />
                  <v-select
                    v-model="formData.comprador_organization.industry_sector"
                    :items="industrySectorItems"
                    label="Setor da Indústria"
                    prepend-inner-icon="mdi-factory"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.comprador_organization.website"
                    label="Website da Empresa"
                    prepend-inner-icon="mdi-web"
                    variant="outlined"
                    required
                  />
                </template>

                <!-- Campos para Auditor -->
                <template v-if="props.userType === 'auditor'">
                  <v-divider class="my-4" />
                  <h3 class="text-subtitle-1 font-weight-medium mb-3">Perfil do Auditor</h3>
                  <v-text-field
                    v-model="formData.auditor_profile.contact_name"
                    label="Nome Completo"
                    prepend-inner-icon="mdi-account-tie"
                    variant="outlined"
                    required
                  />
                  <v-text-field
                    v-model="formData.auditor_profile.phone"
                    label="Telefone para Contato"
                    prepend-inner-icon="mdi-phone"
                    variant="outlined"
                    required
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
                  Criar Conta
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