<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import api from '../services/api';

// Imports de PrimeVue
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card'; 

interface Course {
  id: number;
  name: string;
  imageUrl?: string;
  teacherId?: number;
  status?: string;
}

const authStore = useAuthStore();
const allCourses = ref<Course[]>([]);
const courseDialog = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const courseForm = ref({ 
    name: '', 
    status: 'Activo', 
    teacherId: authStore.user?.id || null, 
    imageUrl: ''
});

const fetchCourses = async () => {
    try {
        const { data } = await api.get('/courses');
        allCourses.value = data || [];
    } catch (e) {
        console.error("Error al cargar cursos:", e);
    }
};

const onFileSelect = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploading.value = true;
    try {
        const { data } = await api.post('/upload/image', formData);
        courseForm.value.imageUrl = data.url;
    } catch (e) { 
        console.error("Error subiendo imagen", e); 
    } finally { 
        uploading.value = false; 
    }
};

const saveCourse = async () => {
    if (!courseForm.value.name) return alert("El nombre es obligatorio");
    
    try {
        await api.post('/courses', courseForm.value);
        courseDialog.value = false;
        // Limpiar el formulario para el próximo curso
        courseForm.value = { name: '', status: 'Activo', teacherId: authStore.user?.id || null, imageUrl: '' };
        fetchCourses();
    } catch (e) {
        alert("Error al guardar curso");
    }
};

onMounted(() => {
    fetchCourses();
});
</script>

<template>
  <div class="w-full p-4 lg:p-8 bg-slate-50/50 min-h-screen">
    <div class="flex justify-between items-end mb-8 ml-2">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Panel Docente</h1>
        <p class="text-slate-500 font-medium text-sm">Gestiona tus contenidos y alumnos asignados</p>
      </div>
      <Button label="Nuevo Curso" icon="pi pi-plus" @click="courseDialog = true" 
              class="bg-emerald-600 text-white border-0 rounded-2xl px-6 py-4 font-bold shadow-lg hover:bg-emerald-700" />
    </div>

    <Card class="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
      <template #content>
        <DataTable :value="allCourses" paginator :rows="10" class="p-datatable-sm">
          <Column header="PORTADA" style="width: 100px">
            <template #body="slotProps">
              <div class="relative w-16 h-12">
                <img :src="slotProps.data.imageUrl || 'https://via.placeholder.com/100'" class="w-full h-full object-cover rounded-xl shadow-sm" />
              </div>
            </template>
          </Column>
          
          <Column field="name" header="CURSO" class="font-bold text-slate-700"></Column>
          
          <Column header="ESTADO">
             <template #body="slotProps">
                <Tag v-if="slotProps.data.teacherId === authStore.user?.id" 
                     value="MI CLASE" severity="success" class="px-3 py-1 rounded-lg" />
                <Tag v-else value="GLOBAL" severity="info" class="px-3 py-1 rounded-lg" />
             </template>
          </Column>

          <Column header="GESTIÓN" class="text-center">
            <template #body>
              <div class="flex gap-2 justify-center">
                <Button icon="pi pi-users" text severity="secondary" v-tooltip="'Ver alumnos'" />
                <Button icon="pi pi-pencil" text severity="warn" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="courseDialog" header="📚 Crear nuevo curso" modal 
            class="mx-4 w-full max-w-md border-0 shadow-2xl" :pt="{ mask: { class: 'backdrop-blur-sm' } }">
        <div class="p-6 flex flex-col gap-6">
            <div class="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                <img v-if="courseForm.imageUrl" :src="courseForm.imageUrl" class="w-32 h-32 object-cover rounded-2xl shadow-md" />
                <div v-else class="w-32 h-32 bg-slate-200 rounded-2xl flex items-center justify-center">
                   <i class="pi pi-image text-slate-400 text-3xl"></i>
                </div>
                <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" />
                <Button :label="uploading ? 'Subiendo...' : 'Cambiar Imagen'" icon="pi pi-upload" 
                        class="p-button-sm font-bold" @click="fileInput?.click()" />
            </div>
            
            <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título del Curso</label>
                <InputText v-model="courseForm.name" placeholder="Ej: Introducción a Vue 3" class="w-full h-12 px-5 rounded-2xl border-slate-200" />
            </div>

            <Button label="Publicar Curso" @click="saveCourse" :disabled="uploading" 
                    class="w-full py-4 font-bold bg-slate-900 text-white border-0 rounded-2xl shadow-xl mt-2" />
        </div>
    </Dialog>
  </div>
</template>