<template>
  <div class="flex justify-center items-center min-h-screen bg-slate-100 p-4">
    <Card style="width: 26rem" class="shadow-2xl border-0">
      <template #header>
        <div class="flex justify-center pt-8">
          <div class="bg-primary-500 text-white rounded-full p-4 shadow-lg">
            <i class="pi pi-lock text-3xl"></i>
          </div>
        </div>
      </template>
      
      <template #title>
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p class="text-sm text-gray-500 font-normal">Ingresa tus credenciales para continuar</p>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-700">Correo Electrónico</label>
            <span class="p-input-icon-left">
              <i class="pi pi-envelope ml-2" />
              <InputText v-model="email" placeholder="correo@ejemplo.com" class="w-full pl-10" />
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-700">Contraseña</label>
            <Password v-model="password" placeholder="Tu contraseña" :feedback="false" 
                      toggleMask class="w-full" inputClass="w-full" />
          </div>

          <Button label="Iniciar Sesión" icon="pi pi-sign-in" @click="handleLogin" 
                  :loading="loading" class="w-full mt-2 py-3" severity="primary" raised />
        </div>
      </template>

      <template #footer>
        <div class="text-center pt-2">
          <p class="text-gray-600">
            ¿No tienes cuenta? 
            <router-link to="/register" class="text-primary-600 font-bold no-underline hover:underline">
              Regístrate aquí
            </router-link>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
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
  if (!email.value || !password.value) return alert("Completa todos los campos");
  
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    
    // Redirección por Rol
    const role = authStore.userRole;
    if (role === 'Admin') router.push('/dashboard/admin');
    else if (role === 'Teacher') router.push('/dashboard/teacher');
    else router.push('/dashboard/student');

  } catch (err) {
    alert("Error: Credenciales inválidas");
  } finally {
    loading.value = false;
  }
};
</script>