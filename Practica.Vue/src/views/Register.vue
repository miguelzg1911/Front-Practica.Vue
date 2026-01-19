<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-slate-100 to-green-50 p-4">
    <Card class="w-full max-w-2xl shadow-2xl border-0 rounded-3xl">
      <template #title>
        <div class="text-center pt-6">
          <h2 class="text-3xl font-black text-slate-800">Crea tu Cuenta</h2>
          <p class="text-slate-500 mt-2">Únete a nuestra academia hoy</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
          
          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Nombre Completo</label>
            <InputText v-model="form.fullName" class="w-full p-3 border-slate-200 rounded-xl" placeholder="Juan Pérez" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Documento</label>
            <InputText v-model="form.document" class="w-full p-3 border-slate-200 rounded-xl" placeholder="ID Number" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Usuario</label>
            <InputText v-model="form.username" class="w-full p-3 border-slate-200 rounded-xl" placeholder="usuario123" />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Email</label>
            <InputText v-model="form.email" class="w-full p-3 border-slate-200 rounded-xl" placeholder="correo@academia.com" />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-xs font-bold uppercase text-slate-500 ml-1">Contraseña</label>
            <Password v-model="form.password" toggleMask class="w-full" inputClass="w-full p-3 border-slate-200 rounded-xl" />
          </div>

          <Button type="submit" label="Registrarme" icon="pi pi-user-plus" 
                  class="w-full py-4 mt-4 md:col-span-2 bg-green-600 hover:bg-green-700 border-0 rounded-xl font-bold shadow-lg" />
        </form>
      </template>

      <template #footer>
        <div class="text-center pb-6">
          <router-link to="/" class="text-slate-500 hover:text-primary-600 transition-colors font-medium">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
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
    alert("Hubo un problema al crear la cuenta. Intenta con otro correo o revisa los datos.");
  }
};
</script>