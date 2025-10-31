<template>
  <v-card class="profile-card pa-4 mb-6">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-avatar size="56" class="mr-4">
          <img :src="props.user?.avatar || 'https://i.pravatar.cc/56'" alt="avatar" />
        </v-avatar>
        <div>
          <div class="profile-email">{{ props.user?.email || 'Sem e-mail' }}</div>
          <div class="profile-approved">
            Verificação:
            <span v-if="props.user?.verification_status">
              Verificado
              <v-icon color="green" small>mdi-check</v-icon>
            </span>
            <span v-else>
              Não aprovado
              <v-icon color="red" small>mdi-close</v-icon>
            </span>
          </div>
          <div class="profile-role">Tipo: {{ props.user?.user_type || 'N/A' }}</div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({ user: Object })
</script>

<style scoped>
.profile-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
  background: linear-gradient(135deg, #00E5D0 0%, #00CFC7 100%);
  color: #004d4a;
}
.profile-role {
  font-weight: 700;
  font-size: 1.2rem;
  color: #f9f9f9;
  display: flex;
  align-items: center;
  gap: 6px;
}
.profile-email {
  font-size: 0.95rem;
  color: #ffffff;
}
.profile-approved {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}
</style>