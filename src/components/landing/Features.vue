<template>
  <v-container fluid class="py-16 bg-grey-lighten-5">
    <v-container>
      <div class="text-center mb-16">
        <h2
          :class="$vuetify.display.mdAndUp ? 'text-h4' : 'text-h5'"
          class="font-weight-bold mb-4"
        >
          Por que escolher a <span class="text-primary">Guarani</span>?
        </h2>
        <p
          class="text-body-1 text-medium-emphasis mx-auto"
          style="max-width: 600px"
        >
          Uma plataforma completa que conecta responsabilidade ambiental com
          tecnologia e transparência
        </p>
      </div>
      <v-row>
        <v-col
          v-for="(feature, index) in features"
          :key="index"
          cols="12"
          md="6"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="h-100"
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              style="transition: all 0.3s ease-in-out"
            >
              <v-card-text class="pa-5 d-flex align-center">
                <v-sheet
                  :color="`${feature.color}-lighten-4`"
                  rounded="lg"
                  class="d-flex align-center justify-center mr-4 flex-shrink-0"
                  height="56"
                  width="56"
                >
                  <v-icon
                    :color="feature.color"
                    :icon="feature.icon"
                    size="28"
                  ></v-icon>
                </v-sheet>
                <div>
                  <h3
                    :class="isHovering ? 'text-primary' : ''"
                    class="text-subtitle-1 font-weight-bold mb-1"
                    style="transition: color 0.3s ease-in-out"
                  >
                    {{ feature.title }}
                  </h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">
                    {{ feature.description }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const features = ref([
  {
    icon: "mdi-leaf",
    title: "Sustentabilidade Real",
    description:
      "Cada crédito representa redução real de CO₂ em projetos certificados na Amazônia",
    color: "primary",
  },
  {
    icon: "mdi-trending-up",
    title: "Marketplace Transparente",
    description:
      "Plataforma digital intuitiva para negociação segura e rastreamento em tempo real",
    color: "secondary",
  },
  {
    icon: "mdi-shield-check-outline",
    title: "Certificação Confiável",
    description:
      "Todos os projetos são verificados e certificados por organismos internacionais",
    color: "success",
  },
  {
    icon: "mdi-earth",
    title: "Impacto Local",
    description:
      "Apoio direto às comunidades de Belém do Pará e preservação da floresta amazônica",
    color: "info",
  },
]);
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui se necessário */
</style>