<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMe } from '@/api/users';
import { useAuthStore } from '@/store/auth';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const error = ref(null);
const me = ref(auth.user || null);

const fetchMe = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await getMe();
    me.value = data;
    auth.user = data;
    localStorage.setItem('authUser', JSON.stringify(data));
  } catch (e) {
    if (e?.response?.status === 401) {
      router.push({ name: 'Login', params: { userType: 'comprador' }, query: { redirect: '/me' } });
    }
    error.value = 'Não foi possível carregar seus dados.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!auth.isAuthenticated) {
    router.push({ name: 'Login', params: { userType: 'comprador' }, query: { redirect: '/me' } });
    return;
  }
  fetchMe();
});
</script>

<template>
  <div>
    <NavBar />
    <main>
      <v-container class="py-8">
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-4">Minha conta</h1>

        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

        <div v-if="loading" class="text-center py-12">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <v-row v-else>
          <v-col cols="12" md="6">
            <v-card class="mb-4" variant="elevated">
              <v-card-title class="text-subtitle-1">Informações básicas</v-card-title>
              <v-card-text>
                <div class="kv"><span class="k">ID</span><span class="v">{{ me?.id }}</span></div>
                <div class="kv"><span class="k">E-mail</span><span class="v">{{ me?.email }}</span></div>
                <div class="kv"><span class="k">Tipo</span><span class="v">{{ me?.user_type }}</span></div>
                <div class="kv"><span class="k">Verificado</span><span class="v">{{ me?.is_verified ? 'Sim' : 'Não' }}</span></div>
                <div class="kv"><span class="k">Status verificação</span><span class="v">{{ me?.verification_status }}</span></div>
                <div class="kv"><span class="k">Criado em</span><span class="v">{{ me?.created_at }}</span></div>
                <div class="kv"><span class="k">Atualizado em</span><span class="v">{{ me?.updated_at }}</span></div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card variant="elevated">
              <v-card-title class="text-subtitle-1">Acessos</v-card-title>
              <v-card-text>
                <div class="kv"><span class="k">Staff</span><span class="v">{{ me?.is_staff ? 'Sim' : 'Não' }}</span></div>
                <div class="kv"><span class="k">Superuser</span><span class="v">{{ me?.is_superuser ? 'Sim' : 'Não' }}</span></div>
                <div class="kv"><span class="k">Auditor</span><span class="v">{{ me?.is_auditor ? 'Sim' : 'Não' }}</span></div>
                <div class="kv"><span class="k">Grupos</span><span class="v">{{ (me?.groups || []).join(', ') || '—' }}</span></div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.kv { display:flex; justify-content: space-between; padding: 6px 0; }
.k { color: rgba(var(--v-theme-on-surface), .7); }
.v { font-weight: 600; }
</style>
