<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; // Cambié @ por ruta relativa por si falla el alias
import api from '../services/api';

// Imports de PrimeVue
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const authStore = useAuthStore();
const allCourses = ref<any[]>([]);
const courseDialog = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const courseForm = ref({ 
    name: '', 
    status: 'Activo', 
    teacherId: null as number | null, 
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
    } catch (e) { console.error(e); } 
    finally { uploading.value = false; }
};

const saveCourse = async () => {
    if (authStore.user) {
        courseForm.value.teacherId = authStore.user.id;
    }
    
    try {
        await api.post('/courses', courseForm.value);
        courseDialog.value = false;
        fetchCourses();
    } catch (e) {
        alert("Error al guardar curso");
    }
};

onMounted(() => {
    if (authStore.user) {
        courseForm.value.teacherId = authStore.user.id;
    }
    fetchCourses();
});
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mis Cursos</h1>
        <Button label="Crear Nuevo Curso" icon="pi pi-plus" @click="courseDialog = true" />
    </div>

    <DataTable :value="allCourses" stripedRows paginator :rows="10">
        <Column header="Imagen">
            <template #body="slotProps">
                <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" class="w-12 h-12 rounded object-cover shadow" />
                <i v-else class="pi pi-book text-gray-300 text-2xl"></i>
            </template>
        </Column>
        <Column field="name" header="Nombre del Curso"></Column>
        <Column header="Relación">
            <template #body="slotProps">
                <Tag v-if="slotProps.data.teacherId === authStore.user?.id" value="Mi Curso" severity="success" />
                <Tag v-else value="Otro Docente" severity="info" />
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="courseDialog" header="Nuevo Curso" modal :style="{ width: '400px' }">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col items-center gap-2 border-b pb-4">
                <img v-if="courseForm.imageUrl" :src="courseForm.imageUrl" class="w-24 h-24 object-cover rounded shadow" />
                <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" />
                <Button :label="uploading ? 'Subiendo...' : 'Elegir Imagen'" icon="pi pi-image" text size="small" @click="fileInput?.click()" />
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-sm font-bold text-gray-600">Nombre del curso</label>
                <InputText v-model="courseForm.name" />
            </div>
            <Button label="Guardar Curso" @click="saveCourse" :disabled="uploading" class="w-full mt-2" />
        </div>
    </Dialog>
  </div>
</template>