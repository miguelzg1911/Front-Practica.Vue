<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/auth';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';

interface Course {
  id: number;
  name: string;
  imageUrl?: string;
  teacherName?: string;
  status?: string;
}

const authStore = useAuthStore();

const allCourses = ref<Course[]>([]);
const enrolledCourses = ref<Course[]>([]);

const fetchData = async () => {
  try {
    // 1. Cargamos todos los cursos para el catálogo
    const resAll = await api.get('/courses');
    allCourses.value = resAll.data;
    
    // 2. Cargamos las inscripciones del estudiante
    const studentId = authStore.user?.id;
    if (studentId) {
      const resMine = await api.get(`/enrollments/student/${studentId}`);
      enrolledCourses.value = resMine.data;

      // --- ESTO ES LO QUE NECESITAMOS REVISAR EN LA CONSOLA ---
      console.log("Datos de mis cursos inscritos:", resMine.data);
      if (resMine.data.length > 0) {
        console.log("Ejemplo de URL cargada:", resMine.data[0].imageUrl);
      }
    }
  } catch (error) {
    console.error("Error al cargar datos", error);
  }
};

const enroll = async (courseId: number) => {
  const studentId = authStore.user?.id;
  if (!studentId) return;

  try {
    await api.post('/enrollments', { courseId, studentId });
    fetchData();
  } catch (e) {
    alert("Ya estás inscrito en este curso");
  }
};

const unenroll = async (courseId: number) => {
  const studentId = authStore.user?.id;
  if (!studentId) return;

  if (confirm("¿Estás seguro de que deseas darte de baja de este curso?")) {
    try {
      // Ajusta la ruta según tu backend (usualmente DELETE envía los IDs)
      await api.delete('/enrollments', { 
        data: { courseId, studentId } 
      });
      fetchData(); // Recargamos para que desaparezca de la lista
    } catch (e) {
      alert("Error al procesar la baja");
    }
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="w-full p-4 lg:p-8 bg-slate-50/50 min-h-screen">
    <div class="mb-8 ml-2">
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Mi Portal Académico</h1>
      <p class="text-slate-500 font-medium text-sm">Explora nuevos conocimientos y gestiona tus clases</p>
    </div>

    <Card class="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
      <template #content>
        <Tabs value="catalog" class="w-full">
          <TabList class="mb-6 border-b border-slate-100 px-4">
            <Tab value="catalog" class="font-bold py-4 px-6">
              <i class="pi pi-search mr-2"></i>Explorar Cursos
            </Tab>
            <Tab value="my-courses" class="font-bold py-4 px-6">
              <i class="pi pi-bookmark mr-2"></i>Mis Inscripciones 
              <span v-if="enrolledCourses.length" class="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {{ enrolledCourses.length }}
              </span>
            </Tab>
          </TabList>

          <TabPanels class="p-4">
            <TabPanel value="catalog">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="course in allCourses" :key="course.id" 
                     class="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
                  
                  <div class="h-40 overflow-hidden relative">
                    <img :src="course.imageUrl || 'https://via.placeholder.com/400x200'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>

                  <div class="p-5 flex flex-col flex-grow">
                    <h2 class="text-lg font-bold text-slate-800 mb-1 leading-tight">{{ course.name }}</h2>
                    <div class="flex items-center gap-2 mb-4 text-slate-500">
                      <i class="pi pi-user text-xs"></i>
                      <span class="text-xs font-medium">Prof. {{ course.teacherName || 'Por asignar' }}</span>
                    </div>
                    
                    <Button @click="enroll(course.id)" label="Inscribirme ahora" icon="pi pi-plus" 
                            class="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl py-3 font-bold text-sm shadow-md" />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="my-courses">
              <div v-if="enrolledCourses.length === 0" class="py-20 text-center">
                <i class="pi pi-info-circle text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500 font-medium">Aún no te has inscrito en ningún curso.</p>
                <Button label="Explorar catálogo" link class="mt-2 font-bold text-blue-600" />
              </div>

              <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="course in enrolledCourses" :key="course.id" 
                     class="flex items-center p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  
                  <div class="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
                    <img 
                      v-if="course.imageUrl" 
                      :src="course.imageUrl" 
                      class="w-full h-full object-cover z-10"
                      @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                    />

                    <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                      <i class="pi pi-image text-2xl"></i>
                      <span class="text-[8px] font-bold uppercase mt-1">Sin imagen</span>
                    </div>
                  </div>

                  <div class="ml-4 flex-grow">
                    <h3 class="font-black text-slate-700 leading-tight mb-1">{{ course.name }}</h3>
                    <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-2">Inscrito</p>
                    
                    <Button 
                      icon="pi pi-sign-out" 
                      label="Darse de baja" 
                      severity="danger" 
                      text 
                      class="p-0 text-xs font-bold hover:underline" 
                      @click="unenroll(course.id)" 
                    />
                  </div>

                  <div class="ml-2">
                    <Button icon="pi pi-chevron-right" text rounded class="text-slate-400" />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>