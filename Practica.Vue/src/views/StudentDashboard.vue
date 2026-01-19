<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Mi Portal Académico</h1>
    
    <Tabs value="catalog">
      <TabList>
        <Tab value="catalog">Cursos Disponibles</Tab>
        <Tab value="my-courses">Mis Inscripciones</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="catalog">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card v-for="course in allCourses" :key="course.id">
              <template #title>{{ course.name }}</template>
              <template #footer>
                <Button label="Inscribirme" class="w-full" @click="enroll(course.id)" />
              </template>
            </Card>
          </div>
        </TabPanel>

        <TabPanel value="my-courses">
          <DataTable :value="enrolledCourses" class="mt-4">
            <Column field="name" header="Nombre del Curso"></Column>
            <Column field="status" header="Estado"></Column>
            <Column header="Acciones">
              <template #body="slotProps">
                <Button label="Darse de baja" severity="danger" text @click="unenroll(slotProps.data.id)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const authStore = useAuthStore();
const allCourses = ref([]);
const enrolledCourses = ref([]);

const fetchData = async () => {
  const resAll = await api.get('/courses');
  allCourses.value = resAll.data;
  
  const resMine = await api.get(`/enrollments/student/${authStore.user.id}`);
  enrolledCourses.value = resMine.data;
};

const enroll = async (courseId) => {
  try {
    await api.post('/enrollments', { courseId, studentId: authStore.user.id });
    fetchData(); // Recargar listas
    alert("Inscrito!");
  } catch (e) { alert("Ya estás inscrito"); }
};

const unenroll = async (courseId) => {
  try {
    // Tu endpoint DELETE espera studentId y courseId
    await api.delete('/enrollments', { data: { courseId, studentId: authStore.user.id } });
    fetchData();
  } catch (e) { alert("Error al darse de baja"); }
};

onMounted(fetchData);
</script>