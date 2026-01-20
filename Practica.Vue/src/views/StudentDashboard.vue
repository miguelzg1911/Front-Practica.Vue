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
    const resAll = await api.get('/courses');
    allCourses.value = resAll.data;
    
    // Usamos el ID del usuario del store
    const studentId = authStore.user?.id;
    if (studentId) {
      const resMine = await api.get(`/enrollments/student/${studentId}`);
      enrolledCourses.value = resMine.data;
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
            <Tab value="catalog" class="font-bold py-4 px-6"><i class="pi pi-search mr-2"></i>Explorar Cursos</Tab>
            <Tab value="my-courses" class="font-bold py-4 px-6"><i class="pi pi-bookmark mr-2"></i>Mis Inscripciones</Tab>
          </TabList>

          <TabPanels class="p-4">
            <TabPanel value="catalog">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="course in allCourses" :key="course.id" 
                     class="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
                  
                  <div class="h-40 overflow-hidden relative">
                    <img :src="course.imageUrl || 'https://via.placeholder.com/400x200'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span class="text-white text-xs font-bold">Ver detalles</span>
                    </div>
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
              <DataTable :value="enrolledCourses" class="p-datatable-sm" tableStyle="min-width: 100%">
                <Column header="VISTA PREVIA" class="w-24">
                  <template #body="slotProps">
                    <img :src="slotProps.data.imageUrl || 'https://via.placeholder.com/100'" class="w-16 h-10 object-cover rounded-lg" />
                  </template>
                </Column>
                <Column field="name" header="NOMBRE DEL CURSO" class="font-bold text-slate-700"></Column>
                <Column header="ACCIONES" class="text-right">
                  <template #body="slotProps">
                    <Button 
                      icon="pi pi-sign-out" 
                      label="Darse de baja" 
                      severity="danger" 
                      text 
                      class="font-bold text-xs" 
                      @click="unenroll(slotProps.data.id)" 
                    />
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>