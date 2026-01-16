<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo electrónico" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
    <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (err) {
    alert("Credenciales incorrectas o error de servidor");
  }
};
</script>