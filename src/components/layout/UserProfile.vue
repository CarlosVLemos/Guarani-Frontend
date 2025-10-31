<template>
  <v-card class="profile-card pa-4 mb-6">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar size="56" class="mr-4">
          <img :src="user.avatar || 'https://i.pravatar.cc/56'" alt="avatar" />
        </v-avatar>
        <div>
          <div class="profile-name">{{ user.name || user.email }}</div>
          <div class="profile-email">{{ user.email }}</div>
          <div class="profile-role">Tipo: {{ user.role }}</div>
        </div>
      </div>
      <v-btn color="error" @click="handleLogout">
        <v-icon left>mdi-logout</v-icon>
        Sair
      </v-btn>
    </div>
  </v-card>
</template>
<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const props = defineProps({ user: Object })
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: linear-gradient(135deg, #00E5D0 0%, #00CFC7 100%);
  color: #004d4a;
}
.profile-name {
  font-weight: 700;
  font-size: 1.2rem;
  color: #f9f9f9;
}
.profile-email {
  font-size: 0.95rem;
  color: #ffffff;
}
.profile-role {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}
</style>