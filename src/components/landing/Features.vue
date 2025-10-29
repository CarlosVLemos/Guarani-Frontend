<template>
  <section id="features">
    <v-container>
      <v-row>
        <v-col class="text-center">
          <h2 class="text-h3 font-weight-bold mb-8">Features</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="n in 3" :key="n" cols="12" md="4">
          <v-card class="pa-4" outlined>
            <v-card-title>Feature {{ n }}</v-card-title>
            <v-card-text>
              This is a description for feature {{ n }}.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
// No script needed
</script>

<style scoped>
#features {
  padding: 60px 0;
}
</style>
