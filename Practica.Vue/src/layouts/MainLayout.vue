<template>
  <div class="min-h-screen bg-slate-50">
    <Menubar :model="menuItems" class="px-6 border-0 shadow-md bg-white">
      <template #start>
        <div class="flex items-center gap-2 mr-4">
          <div class="bg-primary-600 p-2 rounded-lg">
            <i class="pi pi-graduation-cap text-white text-xl"></i>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            EduGestion
          </span>
        </div>
      </template>

      <template #item="{ item, props }">
        <router-link v-if="item.route" :to="item.route" v-bind="props.action" class="flex items-center">
          <span :class="item.icon" class="mr-2" />
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </template>

      <template #end>
        <div class="flex items-center gap-4">
          <div class="hidden md:flex flex-col text-right mr-2">
            <span class="text-sm font-bold text-gray-800">{{ authStore.username || 'Usuario' }}</span>
            <span class="text-xs text-gray-500">{{ authStore.userRole }}</span>
          </div>
          <Button 
            label="Salir" 
            icon="pi pi-sign-out" 
            severity="danger" 
            text 
            @click="logout" 
            class="hover:bg-red-50"
          />
        </div>
      </template>
    </Menubar>

    <main class="p-6 max-w-7xl mx-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

const authStore = useAuthStore();
const router = useRouter();

// Construcción dinámica del menú según el rol
const menuItems = computed(() => {
  const items = [];

  if (authStore.userRole === 'Admin') {
    items.push({ label: 'Administración', icon: 'pi pi-sliders-h', route: '/dashboard/admin' });
  }
  if (authStore.userRole === 'Teacher') {
    items.push({ label: 'Mis Cursos', icon: 'pi pi-book', route: '/dashboard/teacher' });
  }
  if (authStore.userRole === 'Student') {
    items.push({ label: 'Mi Portal', icon: 'pi pi-user', route: '/dashboard/student' });
  }

  return items;
});

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style>
/* Animación suave de cambio de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>