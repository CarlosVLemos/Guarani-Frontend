<template>
  <v-container fluid class="py-16">
    <v-container>
      <!-- Main About -->
      <v-row class="mb-16 align-center">
        <v-col cols="12" lg="6">
          <h2 class="text-h3 text-md-h2 font-weight-bold mb-6">
            Da Amazônia para o Mundo
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Nascemos em Belém do Pará, coração da Amazônia, com a missão de
            democratizar o acesso aos créditos de carbono brasileiros. Nossa
            plataforma conecta empresas que desejam compensar suas emissões
            com projetos reais de preservação ambiental.
          </p>
          <p class="text-body-1 text-medium-emphasis mb-6">
            Cada transação na Guarani representa não apenas a redução de CO₂,
            mas o apoio direto às comunidades locais e à proteção da maior
            floresta tropical do planeta.
          </p>
          <v-row class="mt-8">
            <v-col cols="6">
              <div class="text-h4 font-weight-bold text-primary mb-1">
                100%
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Projetos Amazônicos
              </div>
            </v-col>
            <v-col cols="6">
              <div class="text-h4 font-weight-bold text-secondary mb-1">
                24/7
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Plataforma Disponível
              </div>
            </v-col>
          </v-row>
        </v-col>
        
        <v-col cols="12" lg="6">
          <div class="position-relative">
            <v-img
              :src="belemCity"
              alt="Belém do Pará"
              height="500"
              cover
              class="rounded-xl"
            >
              <div class="gradient-overlay"></div>
            </v-img>
          </div>
        </v-col>
      </v-row>

      <!-- Two Column Grid -->
      <v-row>
        <v-col cols="12" md="6">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="overflow-hidden rounded-xl"
              elevation="0"
            >
              <div class="position-relative">
                <v-img
                  :src="plantingTree"
                  alt="Plantando árvores"
                  height="320"
                  cover
                  :class="isHovering ? 'image-zoom' : ''"
                >
                  <div class="gradient-overlay-white d-flex align-end pa-8">
                    <div>
                      <h3 class="text-h5 font-weight-bold mb-2 text-dark-green">
                        Impacto Mensurável
                      </h3>
                      <p class="text-body-2 mb-0 text-dark-green">
                        Rastreie o impacto real de cada crédito adquirido
                      </p>
                    </div>
                  </div>
                </v-img>
              </div>
            </v-card>
          </v-hover>
        </v-col>

        <v-col cols="12" md="6">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="overflow-hidden rounded-xl"
              elevation="0"
            >
              <div class="position-relative">
                <v-img
                  :src="carbonNetwork"
                  alt="Rede de carbono"
                  height="320"
                  cover
                  :class="isHovering ? 'image-zoom' : ''"
                >
                  <div class="gradient-overlay-white d-flex align-end pa-8">
                    <div>
                      <h3 class="text-h5 font-weight-bold mb-2 text-dark-green">
                        Tecnologia Avançada
                      </h3>
                      <p class="text-body-2 mb-0 text-dark-green">
                        Blockchain e IA para máxima transparência
                      </p>
                    </div>
                  </div>
                </v-img>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
// Importe suas imagens aqui
import belemCity from '@/assets/Belem2.png';
import plantingTree from '@/assets/PlantandoArvore.jpg';
import carbonNetwork from '@/assets/Networking.png';
</script>

<style scoped>
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  border-radius: 12px;
}

.gradient-overlay-white {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 40%,
    transparent 70%
  );
}

.text-dark-green {
  color: #1b4332;
}

.image-zoom {
  transition: transform 0.3s ease-in-out;
  transform: scale(1.1);
}

.v-img {
  transition: transform 0.3s ease-in-out;
}
</style>