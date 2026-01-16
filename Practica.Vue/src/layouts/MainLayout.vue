<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="logo">Colegio App</div>
      <ul class="nav-links">
        <li v-if="authStore.userRole === 'Admin'"><router-link to="/admin">Admin</router-link></li>
        <li v-if="authStore.userRole === 'Teacher'"><router-link to="/teacher">Profesor</router-link></li>
        <li v-if="authStore.userRole === 'Student'"><router-link to="/student">Estudiante</router-link></li>
        
        <li><router-link to="/courses">Cursos</router-link></li>
        
        <li><button @click="logout" class="btn-logout">Cerrar Sesión</button></li>
      </ul>
    </nav>

    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
}
.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.content {
  padding: 20px;
}
.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>