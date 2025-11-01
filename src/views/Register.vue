<script setup>
import RegisterForm from '@/components/forms/RegisterForm.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userType = route.params.userType || 'comprador'; // Default to 'comprador' if no param
</script>

<template>
  <RegisterForm :user-type="userType" />
</template>
