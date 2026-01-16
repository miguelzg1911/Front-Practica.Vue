<template>
  <div class="auth-container">
    <h2>Crear Cuenta</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="form.username" type="text" placeholder="Nombre de usuario" required />
      <input v-model="form.email" type="email" placeholder="Correo electrónico" required />
      <input v-model="form.password" type="password" placeholder="Contraseña" required />
      
      <label>Registrarme como:</label>
      <select v-model="form.role">
        <option :value="3">Estudiante</option>
        <option :value="2">Profesor</option>
        <option :value="1">Admin (Solo para el primero)</option>
      </select>

      <button type="submit">Registrarse</button>
    </form>
    <router-link to="/">¿Ya tienes cuenta? Inicia sesión</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const form = ref({ username: '', email: '', password: '', role: 3 });

const handleRegister = async () => {
  try {
    await api.post('/auth/register', form.value);
    alert("Registro exitoso. Ahora inicia sesión.");
    router.push('/');
  } catch (error) {
    alert("Error al registrarse. Revisa los datos.");
  }
};
</script>