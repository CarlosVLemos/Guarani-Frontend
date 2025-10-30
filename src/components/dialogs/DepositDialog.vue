<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:modelValue="emit('update:modelValue', $event)"
    content-class="deposit-dialog"
  >
    <v-card class="dialog-card">
      <v-card-title class="dialog-title">
        <v-icon color="primary" class="mr-2">mdi-cash-plus</v-icon>
        Depositar Créditos
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="depositAmount"
          label="Valor (R$)"
          type="number"
          min="0"
          class="deposit-input"
          color="primary"
          variant="outlined"
          rounded
        />
        <div class="text-caption mt-2 info-text">
          Esse é um flow de demonstração — integrar com API depois.
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text class="cancel-btn" @click="close">Cancelar</v-btn>
        <v-btn  class="confirm-btn" rounded elevation="2" @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue', 'deposit']);
const depositAmount = ref(null);
const close = () => emit('update:modelValue', false);
const confirm = () => {
  emit('deposit', Number(depositAmount.value) || 0);
  close();
};
</script>
<style scoped>
.deposit-dialog {
  /* Fundo levemente escurecido */
  background: rgba(0, 229, 208, 0.08);
}
.dialog-card {
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 229, 208, 0.12);
  border: 1px solid #00E5D0;
}
.dialog-title {
  font-weight: 600;
  font-size: 1.2rem;
  color: #004d4a;
  display: flex;
  align-items: center;
}
.deposit-input {
  margin-top: 12px;
}
.info-text {
  color: #00CFC7;
}
.cancel-btn {
  color: #004d4a;
  font-weight: 500;
}
.confirm-btn {
  background: linear-gradient(135deg, #00E5D0, #00CFC7);
  color: #fff;
  font-weight: 600;
}
</style>