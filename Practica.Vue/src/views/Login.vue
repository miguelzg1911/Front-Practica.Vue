<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
    <Card class="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden bg-white">
      <template #header>
        <div class="flex flex-col items-center pt-10 pb-2">
          <div class="bg-blue-50 text-blue-600 rounded-2xl p-4 mb-4">
            <i class="pi pi-lock text-3xl"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-800">Bienvenido</h2>
          <p class="text-slate-400 font-medium mt-1">Accede a tu cuenta</p>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-6 px-4">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-widest">Correo Electronico</label>
            <InputText v-model="email" placeholder="correo@ejemplo.com" 
                       class="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div class="flex flex-col gap-2 w-full">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Contraseña</label>
            <Password 
              v-model="password" 
              :feedback="false" 
              toggleMask 
              class="w-full" 
              inputClass="w-full p-3 border border-slate-200 rounded-xl pr-12 h-12" 
              placeholder="••••••••"
            />
          </div>

          <div class="flex justify-center mt-2">
            <Button label="Iniciar Sesión" icon="pi pi-sign-in" @click="handleLogin" :loading="loading" 
                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95" />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="text-center pb-8 pt-4">
          <p class="text-slate-400 font-medium">
            ¿No tienes cuenta? 
            <router-link to="/register" class="text-blue-600 font-bold hover:underline">Regístrate</router-link>
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

    const role = authStore.user?.role; 

    if (role === 'Admin') {
      router.push('/dashboard/admin');
    } else if (role === 'Teacher') {
      router.push('/dashboard/teacher');
    } else {
      router.push('/dashboard/student');
    }

  } catch (err) {
    alert("Error: Credenciales inválidas");
  } finally {
    loading.value = false;
  }
};
</script>