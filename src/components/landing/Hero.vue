<template>
  <section id="hero">
    <v-container class="fill-height text-center">
      <v-row align="center" justify="center">
        <v-col>
          <h1 class="text-h2 font-weight-bold mb-4">Hero Section</h1>
          <p class="text-h5">Welcome to our awesome landing page.</p>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
