<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4">
    
    <Card class="w-full max-w-md shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <template #header>
        <div class="h-2 bg-primary-600"></div>
        <div class="flex flex-col items-center pt-8 pb-2">
          <div class="bg-primary-50 text-primary-600 rounded-2xl p-4 mb-4">
            <i class="pi pi-lock text-3xl"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-800">Bienvenido</h2>
          <p class="text-slate-500 font-medium">Accede a tu cuenta</p>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope ml-3 text-slate-400" />
              <InputText v-model="email" placeholder="correo@ejemplo.com" class="w-full pl-11 py-3 border-slate-200 rounded-xl" />
            </span>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Contraseña</label>
            <Password v-model="password" :feedback="false" toggleMask 
                      class="w-full" inputClass="w-full p-3 border-slate-200 rounded-xl" placeholder="••••••••" />
          </div>

          <Button label="Iniciar Sesión" icon="pi pi-sign-in" @click="handleLogin" 
                  :loading="loading" class="w-full py-4 bg-primary-600 hover:bg-primary-700 border-0 rounded-xl font-bold shadow-lg transition-all active:scale-95" />
        </div>
      </template>

      <template #footer>
        <div class="text-center pt-2 pb-6">
          <p class="text-slate-500">
            ¿No tienes cuenta? 
            <router-link to="/register" class="text-primary-600 font-bold hover:underline">Regístrate</router-link>
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