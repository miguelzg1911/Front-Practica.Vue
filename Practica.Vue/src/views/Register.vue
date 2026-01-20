<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
    <Card class="w-full max-w-2xl shadow-2xl border-0 rounded-3xl bg-white overflow-hidden">
      
      <template #title>
        <div class="text-center pt-8">
          <div class="inline-flex bg-green-50 text-green-600 rounded-2xl p-3 mb-4">
            <i class="pi pi-user-plus text-3xl"></i>
          </div>
          <h2 class="text-3xl font-black text-slate-800 tracking-tight">Crea tu Cuenta</h2>
          <p class="text-slate-400 mt-1 font-medium text-sm text-balance">Únete a nuestra academia hoy mismo</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 px-6 pt-6 pb-8">
          
          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Nombre Completo</label>
            <InputText v-model="form.fullName" placeholder="Ej: Juan Pérez García" 
                       class="w-full border border-slate-200 rounded-xl" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Documento</label>
            <InputText v-model="form.document" placeholder="Número de ID" 
                       class="w-full border border-slate-200 rounded-xl" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Usuario</label>
            <InputText v-model="form.username" placeholder="Ej: JuanP123" 
                       class="w-full border border-slate-200 rounded-xl" />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Correo Electrónico</label>
            <InputText v-model="form.email" type="email" placeholder="correo@academia.com" 
                       class="w-full border border-slate-200 rounded-xl" />
          </div>

          <div class="flex flex-col gap-2 w-full">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Contraseña</label>
            <Password 
              v-model="form.password" 
              :feedback="true" 
              toggleMask 
              class="w-full" 
              inputClass="w-full" 
              placeholder="••••••••"
            />
          </div>

          <div class="md:col-span-2 flex justify-center mt-6">
            <Button type="submit" label="Registrarme" icon="pi pi-check-circle" 
                    class="px-12 py-4 bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl font-bold shadow-lg shadow-green-100 transition-transform active:scale-95" />
          </div>
        </form>
      </template>

      <template #footer>
        <div class="text-center pb-8 pt-4">
          <p class="text-slate-400 font-medium">
            ¿Ya eres parte de la academia? 
            <router-link to="/" class="text-blue-600 font-bold no-underline hover:underline ml-1">
              Inicia sesión
            </router-link>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();

const form = ref({ 
  username: '', 
  fullName: '', 
  document: '', 
  email: '', 
  password: ''
});

const handleRegister = async () => {
  if (!form.value.username || !form.value.fullName || !form.value.document || !form.value.email || !form.value.password) {
    return alert("Por favor, llena todos los campos obligatorios");
  }

  try {
    await api.post('/auth/register', form.value);
    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    router.push('/');
  } catch (error) {
    console.error(error);
    alert("Hubo un problema al crear la cuenta.");
  }
};
</script>