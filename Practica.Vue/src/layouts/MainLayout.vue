<template>
  <div class="min-h-screen bg-slate-50">
    <nav class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="bg-blue-600 p-2 rounded-lg">
          <i class="pi pi-graduation-cap text-white text-xl"></i>
        </div>
        <span class="text-xl font-black text-slate-800 tracking-tight">EduGestion</span>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex gap-2 mr-4">
          <router-link v-for="item in menuItems" :key="item.label" :to="item.route" 
            class="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            active-class="text-blue-600 bg-blue-50">
            <i :class="item.icon"></i>
            {{ item.label }}
          </router-link>
        </div>

        <div class="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-black text-blue-600 uppercase leading-none">{{ authStore.userRole }}</p>
            <p class="text-sm font-bold text-slate-700">{{ authStore.username || 'Usuario' }}</p>
          </div>
          <Button icon="pi pi-sign-out" label="Salir" text severity="danger" 
                  class="font-bold hover:bg-red-50 rounded-xl px-4" @click="logout" />
        </div>
      </div>
    </nav>

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