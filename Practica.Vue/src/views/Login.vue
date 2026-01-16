<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <Card style="width: 25rem">
      <template #title> Iniciar Sesión </template>
      <template #content>
        <div class="flex flex-col gap-3">
          <InputText v-model="email" placeholder="Correo electrónico" type="email" />
          <Password v-model="password" placeholder="Contraseña" :feedback="false" toggleMask />
          <Button label="Entrar" @click="handleLogin" :loading="loading" />
        </div>
      </template>
      <template #footer>
        <p class="text-sm">¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
// Importar componentes de PrimeVue
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const email = ref('');
const password = ref('');
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    
    // Redirección dinámica según el rol que acaba de guardar Pinia
    const role = authStore.userRole;
    if (role === 'Admin') router.push('/admin');
    else if (role === 'Teacher') router.push('/teacher');
    else router.push('/student');

  } catch (err) {
    alert("Error: Revisa tus credenciales");
  } finally {
    loading.value = false;
  }
};
</script>