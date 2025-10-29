<template>
  <v-container fluid class="py-16 position-relative overflow-hidden bg-white">
    <v-container class="position-relative">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="text-center">
            <h2 class="text-h3 text-md-h2 font-weight-bold mb-6 text-dark-green">
              Pronto para fazer a diferença?
            </h2>
            <p class="text-body-1 mb-10 text-dark-green">
              Junte-se a centenas de empresas que já estão compensando suas
              emissões e preservando a Amazônia através da Guarani.
            </p>
            
            <div class="d-flex flex-column flex-sm-row ga-4 justify-center align-center">
              <v-btn
                size="large"
                color="success"
                class="btn-with-icon text-white"
                elevation="4"
              >
                Criar Conta Gratuita
                <v-icon class="ml-2 arrow-icon">mdi-arrow-right</v-icon>
              </v-btn>
              
              <v-btn
                size="large"
                variant="outlined"
                color="success"
                class="text-dark-green"
              >
                <v-icon class="mr-2">mdi-email-outline</v-icon>
                Falar com Especialista
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
// Nenhuma importação necessária para este componente
</script>

<style scoped>
.text-dark-green {
  color: #1b4332;
}

.btn-with-icon:hover .arrow-icon {
  transform: translateX(4px);
}

.arrow-icon {
  transition: transform 0.3s ease-in-out;
}

.bg-white {
  background-color: white;
}
</style>