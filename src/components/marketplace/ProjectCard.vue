<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Importa as imagens específicas dos assets
import sitioImage from '@/assets/Sitiodoalvaro.jpeg';
import samaraImage from '@/assets/Samararenova.jpeg';

const props = defineProps({
  project: { type: Object, required: true },
});

const emit = defineEmits(['buy']);
const router = useRouter();

const imageUrl = computed(() => {
  // 1. Lógica para projetos específicos
  if (props.project.name === 'sitio do alvaro amarelo') {
    return sitioImage;
  }
  if (props.project.name === 'Samara renova guama') {
    return samaraImage;
  }

  // 2. Lógica original para imagens do backend
  if (props.project.image) return props.project.image;

  const documents = props.project.documents || [];
  const mainPhoto = documents.find(d => d.name === '__main_photo__');
  if (mainPhoto) return mainPhoto.file;

  const anyImage = documents.find(d => d.file);
  if (anyImage) return anyImage.file;

  // 3. Lógica de placeholder aleatório, mas consistente por projeto
  const seed = props.project.id || props.project.name; // Usa ID ou nome como semente
  return `https://picsum.photos/seed/${seed}/400/300`;
});

const priceLabel = computed(() => {
  return props.project.price_per_credit || props.project.price_per_credit_at_purchase || '—';
});

const goToDetails = () => {
  router.push({ name: 'ProjectDetails', params: { id: props.project.id } });
};
</script>

<template>
  <v-card class="project-card" rounded="lg" elevation="4" @click="goToDetails">
    <v-img :src="imageUrl" height="180" cover class="project-image" />

    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold">
        {{ project.name }}
      </v-card-title>
      <v-card-subtitle class="text-body-2">
        {{ project.location || 'Localização indisponível' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="text-caption text-medium-emphasis">Preço por crédito</div>
          <div class="text-h6">R$ {{ priceLabel }}</div>
        </div>
        <div>
          <div class="text-caption text-medium-emphasis">Créditos disponíveis</div>
          <div class="text-h6">{{ project.carbon_credits_available ?? '—' }}</div>
        </div>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" class="btn--buy" @click.stop="$emit('buy', project)">Comprar crédito</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.project-card {
  transition: transform .25s ease, box-shadow .25s ease;
  cursor: pointer;
}
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}
.project-image::v-deep(img) {
  filter: saturate(1.05);
}
.btn--buy {
  background: linear-gradient(135deg, #00E5D0, #00CFC7) !important;
  color: #fff !important;
  font-weight: 600;
}
</style>
