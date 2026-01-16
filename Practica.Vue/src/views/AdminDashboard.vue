<template>
  <div class="dashboard">
    <h1>Panel de Administración</h1>
    <nav>
      <button @click="currentTab = 'users'">Gestionar Usuarios</button>
      <button @click="currentTab = 'reports'">Reportes Generales</button>
    </nav>

    <div v-if="currentTab === 'users'">
      <h3>Usuarios Registrados</h3>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const currentTab = ref('users');
</script>