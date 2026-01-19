<template>
  <div class="flex justify-center items-center min-h-screen bg-slate-50 p-4">
    <Card style="width: 35rem" class="shadow-xl border-t-4 border-primary-500">
      <template #title>
        <div class="text-center mb-2">
          <i class="pi pi-user-plus text-4xl text-primary-500 mb-3"></i>
          <h2 class="text-2xl font-bold text-gray-800">Nueva Cuenta</h2>
          <p class="text-sm text-gray-500 font-normal">Regístrate como estudiante hoy mismo</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div class="flex flex-col gap-1 col-span-2">
            <label class="text-sm font-semibold text-gray-600">Nombre Completo</label>
            <InputText v-model="form.fullName" placeholder="Ej: Juan Pérez García" class="w-full" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-600">Documento de Identidad</label>
            <InputText v-model="form.document" placeholder="Número de identificación" class="w-full" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-semibold text-gray-600">Nombre de Usuario</label>
            <InputText v-model="form.username" placeholder="Ej: JuanPerez" class="w-full" />
          </div>

          <div class="flex flex-col gap-1 col-span-2">
            <label class="text-sm font-semibold text-gray-600">Correo Electrónico</label>
            <InputText v-model="form.email" type="email" placeholder="correo@academia.com" class="w-full" />
          </div>

          <div class="flex flex-col gap-1 col-span-2">
            <label class="text-sm font-semibold text-gray-600">Contraseña Segura</label>
            <Password v-model="form.password" toggleMask :feedback="true" 
                      placeholder="Mínimo 6 caracteres" class="w-full" inputClass="w-full" />
          </div>

          <Button type="submit" label="Crear mi cuenta" icon="pi pi-check" 
                  class="w-full mt-4 py-3 col-span-2" severity="success" raised />
        </form>
      </template>

      <template #footer>
        <div class="flex justify-center gap-2 border-t pt-4">
          <span class="text-gray-500">¿Ya eres parte de la academia?</span>
          <router-link to="/" class="text-primary font-bold no-underline hover:underline">
            Inicia sesión
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