<template>
  <div class="flex justify-center items-center min-h-screen bg-slate-50">
    <Card style="width: 28rem" class="shadow-xl">
      <template #title>
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold">Crear Cuenta</h2>
          <p class="text-sm text-gray-500 font-normal">Regístrate como estudiante para comenzar</p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
          
          <div class="flex flex-col gap-2">
            <label for="username" class="font-semibold">Nombre de usuario</label>
            <InputText id="username" v-model="form.username" placeholder="Ej: JuanPerez123" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold">Correo electrónico</label>
            <InputText id="email" v-model="form.email" type="email" placeholder="usuario@correo.com" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold">Contraseña</label>
            <Password id="password" v-model="form.password" toggleMask :feedback="true" placeholder="••••••••" class="w-full" inputClass="w-full" />
          </div>

          <Button type="submit" label="Registrarse" icon="pi pi-user-plus" class="w-full mt-4" severity="primary" />
        </form>
      </template>

      <template #footer>
        <div class="text-center border-t pt-4">
          <router-link to="/" class="text-primary no-underline hover:underline font-medium">
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
import { UserRole } from '../models/Auth';

// PrimeVue Components
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';

const router = useRouter();

const form = ref({ 
  username: '', 
  email: '', 
  password: '', 
  role: UserRole.Student // Inicializamos con el valor del Enum (3)
});

const handleRegister = async () => {
  try {
    await api.post('/auth/register', form.value);
    alert("Registro exitoso.");
    router.push('/');
  } catch (error) {
    console.error(error);
    alert("Error al registrarse. Revisa los datos.");
  }
};
</script>