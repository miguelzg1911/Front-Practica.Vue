<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const authStore = useAuthStore();
const allCourses = ref([]);
const enrolledCourses = ref([]);

const fetchData = async () => {
  try {
    const resAll = await api.get('/courses');
    allCourses.value = resAll.data;
    
    const resMine = await api.get(`/enrollments/student/${authStore.user.id}`);
    enrolledCourses.value = resMine.data;
  } catch (error) {
    console.error("Error al cargar datos", error);
  }
};

const enroll = async (courseId) => {
  try {
    await api.post('/enrollments', { courseId, studentId: authStore.user.id });
    fetchData();
    alert("¡Inscripción exitosa!");
  } catch (e) {
    alert("Ya estás inscrito en este curso");
  }
};

const unenroll = async (courseId) => {
  if(confirm("¿Deseas darte de baja de este curso?")) {
    try {
      await api.delete('/enrollments', { data: { courseId, studentId: authStore.user.id } });
      fetchData();
    } catch (e) { alert("Error al dar de baja"); }
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Mi Portal Académico</h1>
    
    <Tabs value="catalog">
      <TabList>
        <Tab value="catalog">Explorar Cursos</Tab>
        <Tab value="my-courses">Mis Inscripciones</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="catalog">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            <div v-for="course in allCourses" :key="course.id" 
                 class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
              
              <div class="h-44 bg-gray-200 relative">
                <img v-if="course.imageUrl" :src="course.imageUrl" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 italic">
                  <i class="pi pi-image text-4xl"></i>
                </div>
              </div>

              <div class="p-4 flex flex-col flex-grow">
                <h2 class="text-xl font-bold text-gray-800 mb-1">{{ course.name }}</h2>
                <p class="text-gray-500 text-sm mb-4">Prof. {{ course.teacherName || 'Por asignar' }}</p>
                
                <Button label="Inscribirme" icon="pi pi-check" class="w-full mt-auto" @click="enroll(course.id)" />
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="my-courses">
          <DataTable :value="enrolledCourses" class="mt-4" stripedRows>
            <Column header="Imagen">
                <template #body="slotProps">
                    <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" class="w-12 h-8 rounded object-cover" />
                </template>
            </Column>
            <Column field="name" header="Curso"></Column>
            <Column header="Acciones">
              <template #body="slotProps">
                <Button icon="pi pi-sign-out" label="Baja" severity="danger" text @click="unenroll(slotProps.data.id)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>