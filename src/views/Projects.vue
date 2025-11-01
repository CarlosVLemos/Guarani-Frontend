<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProjects } from '@/api/projects';
import { createTransaction } from '@/api/marketplace';
import { useAuthStore } from '@/store/auth';
import ProjectCard from '@/components/marketplace/ProjectCard.vue';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';
import heroImage from '@/assets/PlanodefundoArvore.png';

const router = useRouter();
const auth = useAuthStore();

const loading = ref(false);
const error = ref(null);
const projects = ref([]);

// purchase modal state
const purchaseDialog = ref(false);
const selectedProject = ref(null);
const quantity = ref(1);
const creating = ref(false);

// hero background style (reuse home vibe)
const heroStyle = {
  '--hero-background-image': `url(${heroImage})`
};

const fetchProjects = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await getProjects({ status: 'ACTIVE' });
    const results = data.results ?? data ?? [];
    
    // Filtra para garantir que todos os projetos na lista são únicos pelo ID
    const uniqueProjects = Array.from(new Map(results.map(p => [p.id, p])).values());
    
    projects.value = uniqueProjects;
  } catch (e) {
    console.error(e);
    error.value = 'Falha ao carregar projetos.';
  } finally {
    loading.value = false;
  }
};

const openBuy = (project) => {
  selectedProject.value = project;
  quantity.value = 1;
  if (!auth.isAuthenticated) {
    router.push({ name: 'Login', params: { userType: 'comprador' }, query: { redirect: router.currentRoute.value.fullPath } });
  } else {
    purchaseDialog.value = true;
  }
};

const totalPrice = () => {
  const price = Number(selectedProject.value?.price_per_credit || 0);
  return (price * Number(quantity.value || 0)).toFixed(2);
};

const buy = async () => {
  if (!selectedProject.value) return;
  creating.value = true;
  try {
    await createTransaction({
      project: selectedProject.value.id,
      quantity: Number(quantity.value),
    });
    purchaseDialog.value = false;
  } catch (e) {
    if (e?.response?.status === 401) {
      router.push({ name: 'Login', params: { userType: 'comprador' } });
    }
    console.error(e);
  } finally {
    creating.value = false;
  }
};

onMounted(fetchProjects);
</script>

<template>
  <div>
    <NavBar />
    <main>
      <!-- Hero/Topo visual para combinar com a Home -->
      <section class="projects-hero" :style="heroStyle">
        <div class="hero-background"></div>
        <div class="hero-overlay"></div>
        <v-container class="hero-content">
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-2">
            <span class="brand">Guarani</span> <span class="text-gradient">Projetos</span>
          </h1>
          <p class="text-body-1 text-md-subtitle-1 max-w">
            Explore projetos sustentáveis e compre créditos de carbono da Amazônia.
          </p>
        </v-container>
      </section>

      <section class="projects-list">
        <v-container>
          <div class="d-flex align-center justify-space-between mb-6">
            <h2 class="text-h5 text-md-h4 font-weight-bold">Projetos disponíveis</h2>
          </div>

          <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

          <v-row v-if="loading" dense>
            <v-col cols="12" class="text-center py-12">
              <v-progress-circular indeterminate color="primary" />
            </v-col>
          </v-row>

          <v-row v-else dense>
            <v-col v-for="p in projects" :key="p.id" cols="12" sm="6" md="4" lg="3">
              <ProjectCard :project="p" @buy="openBuy" />
            </v-col>
          </v-row>
        </v-container>
      </section>
    </main>
    <Footer />

    <!-- Purchase dialog -->
    <v-dialog v-model="purchaseDialog" max-width="520">
      <v-card>
        <v-card-title class="text-h6">Comprar créditos</v-card-title>
        <v-card-text>
          <div class="mb-2 text-subtitle-2">{{ selectedProject?.name }}</div>
          <v-text-field
            v-model.number="quantity"
            type="number"
            label="Quantidade"
            min="1"
            :max="selectedProject?.carbon_credits_available || undefined"
          />
          <div class="d-flex justify-end text-subtitle-1">
            Total: <strong class="ml-1">R$ {{ totalPrice() }}</strong>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="purchaseDialog = false">Cancelar</v-btn>
          <v-btn color="primary" :loading="creating" @click="buy">Confirmar compra</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  
</template>

<style scoped>
main > section { padding: 4rem 0; }

.projects-hero {
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
}
.projects-hero .hero-background {
  position: absolute; inset: 0;
  background-image: var(--hero-background-image);
  background-size: cover; background-position: center;
  z-index: 1;
}
.projects-hero .hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.85), #FFF);
  z-index: 2;
}
.v-theme--dark .projects-hero .hero-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85), #000);
}
.projects-hero .hero-content {
  position: relative; z-index: 3;
}
.text-gradient {
  background: linear-gradient(135deg, #00E5D0, #00CFC7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #00CFC7;
}
.brand { opacity: .9; }
.max-w { max-width: 720px; }

.projects-list {
  background: linear-gradient(180deg, rgba(0,186,180,0.06), rgba(0,186,180,0.02));
}
</style>
