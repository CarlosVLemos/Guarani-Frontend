<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  project: { type: Object, required: true },
});

const emit = defineEmits(['buy']);

const imageUrl = computed(() => {
  // assume project.documents may have images; fallback placeholder
  const doc = (props.project.documents || []).find(d => d.file);
  return doc?.file || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop';
});

const priceLabel = computed(() => {
  return props.project.price_per_credit || props.project.price_per_credit_at_purchase || '—';
});
</script>

<template>
  <v-card class="project-card" rounded="lg" elevation="4">
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
      <v-btn color="primary" class="btn--buy" @click="$emit('buy', project)">Comprar crédito</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.project-card {
  transition: transform .25s ease, box-shadow .25s ease;
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
