<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import api from '../services/api';

// Imports de PrimeVue
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

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
const isEditing = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const courseForm = ref({ 
    id: null as number | null,
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

// --- ACCIONES ---

const openNew = () => {
    isEditing.value = false;
    courseForm.value = { id: null, name: '', status: 'Activo', teacherId: authStore.user?.id || null, imageUrl: '' };
    courseDialog.value = true;
};

const editCourse = (course: Course) => {
    isEditing.value = true;
    courseForm.value = {
        id: course.id,
        name: course.name,
        status: course.status || 'Activo',
        teacherId: course.teacherId || authStore.user?.id || null,
        imageUrl: course.imageUrl || ''
    };
    courseDialog.value = true;
};

const deleteCourse = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este curso?")) {
        try {
            await api.delete(`/courses/${id}`);
            fetchCourses();
        } catch (e) {
            alert("Error al eliminar");
        }
    }
};

const saveCourse = async () => {
    if (!courseForm.value.name) return alert("El nombre es obligatorio");
    
    try {
        if (isEditing.value && courseForm.value.id) {
            await api.put(`/courses/${courseForm.value.id}`, courseForm.value);
        } else {
            await api.post('/courses', courseForm.value);
        }
        courseDialog.value = false;
        fetchCourses();
    } catch (e) {
        alert("Error al guardar");
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

onMounted(fetchCourses);
</script>

<template>
  <div class="w-full p-4 lg:p-8 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Panel Docente</h1>
        <p class="text-slate-500 font-medium">Administra tus materiales y cursos publicados</p>
      </div>
      <Button label="Nuevo Curso" icon="pi pi-plus" @click="openNew" 
              class="bg-emerald-600 text-white border-0 rounded-2xl px-6 py-4 font-bold shadow-lg hover:scale-105 transition-transform" />
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div v-for="course in allCourses" :key="course.id" 
           class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
        
        <div class="h-48 overflow-hidden relative">
          <img :src="course.imageUrl || 'https://via.placeholder.com/400x300'" 
               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute top-4 right-4">
            <Tag :value="course.teacherId === authStore.user?.id ? 'Mío' : 'Global'" 
                 :severity="course.teacherId === authStore.user?.id ? 'success' : 'info'" 
                 class="px-3 rounded-full font-bold shadow-md" />
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow">
          <h2 class="text-xl font-bold text-slate-800 mb-4 leading-tight">{{ course.name }}</h2>
          
          <div class="mt-auto flex gap-3">
            <Button icon="pi pi-pencil" label="Editar" @click="editCourse(course)"
                    class="flex-1 bg-amber-50 text-amber-600 border-0 rounded-xl font-bold py-2 text-sm hover:bg-amber-100" />
            
            <Button icon="pi pi-trash" severity="danger" text @click="deleteCourse(course.id)"
                    class="rounded-xl hover:bg-red-50" />
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="courseDialog" :header="isEditing ? '📝 Editar Curso' : '📚 Nuevo Curso'" modal 
            class="mx-4 w-full max-w-md border-0 shadow-2xl" :pt="{ mask: { class: 'backdrop-blur-sm' } }">
        <div class="p-6 flex flex-col gap-6">
            <div class="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200">
                <img v-if="courseForm.imageUrl" :src="courseForm.imageUrl" class="w-32 h-32 object-cover rounded-2xl shadow-md" />
                <div v-else class="w-32 h-32 bg-slate-200 rounded-2xl flex items-center justify-center">
                   <i class="pi pi-image text-slate-400 text-3xl"></i>
                </div>
                <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" />
                <Button :label="uploading ? 'Subiendo...' : 'Cambiar Imagen'" icon="pi pi-upload" 
                        class="p-button-sm font-bold text-blue-600" text @click="fileInput?.click()" />
            </div>
            
            <div class="flex flex-col gap-2">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Título del Curso</label>
                <InputText v-model="courseForm.name" placeholder="Ej: Química Orgánica" class="w-full h-12 px-5 rounded-2xl border-slate-200" />
            </div>

            <Button :label="isEditing ? 'Guardar Cambios' : 'Publicar Curso'" @click="saveCourse" :disabled="uploading" 
                    class="w-full py-4 font-bold bg-slate-900 text-white border-0 rounded-2xl shadow-xl mt-2 hover:bg-black" />
        </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* Asegura que los títulos largos no rompan la cuadrícula */
h2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.5rem; /* Ajusta según el tamaño de tu fuente */
}
</style>