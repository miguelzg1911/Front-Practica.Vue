<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const authStore = useAuthStore();
const allCourses = ref([]);
const courseDialog = ref(false);
const studentListVisible = ref(false); // Controla el modal de alumnos
const studentsInCourse = ref([]);     // Guarda los alumnos del curso seleccionado

const courseForm = ref({ 
    name: '', 
    status: 'Activo', 
    teacherId: authStore.user.id 
});

const fetchCourses = async () => {
    const { data } = await api.get('/courses');
    allCourses.value = data;
};

const saveCourse = async () => {
    await api.post('/courses', courseForm.value);
    courseDialog.value = false;
    fetchCourses();
};

const loadStudents = async (courseId) => {
    try {
        const { data } = await api.get(`/enrollments/course/${courseId}`);
        studentsInCourse.value = data;
        studentListVisible.value = true; // Aquí abrimos el modal
    } catch (error) {
        console.error("Error cargando alumnos", error);
    }
};

onMounted(fetchCourses);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mis Cursos y Catálogo</h1>
        <Button label="Crear Nuevo Curso" icon="pi pi-plus" @click="courseDialog = true" />
    </div>

    <DataTable :value="allCourses" stripedRows>
        <Column field="name" header="Nombre del Curso"></Column>
        <Column field="teacherName" header="Profesor"></Column>
        <Column header="Acciones">
            <template #body="slotProps">
                <div v-if="slotProps.data.teacherId === authStore.user.id" class="flex gap-2">
                    <Button icon="pi pi-users" severity="info" rounded text tooltip="Ver Alumnos" @click="loadStudents(slotProps.data.id)" />
                    <Button icon="pi pi-pencil" severity="warning" rounded text />
                    <Button icon="pi pi-trash" severity="danger" rounded text />
                </div>
                <Tag v-else value="Solo Lectura" severity="secondary" />
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="courseDialog" header="Nuevo Curso" :modal="true">
        <div class="flex flex-col gap-4">
            <label>Nombre del curso</label>
            <InputText v-model="courseForm.name" />
        </div>
        <template #footer>
            <Button label="Guardar" @click="saveCourse" />
        </template>
    </Dialog>

    <Dialog v-model:visible="studentListVisible" header="Alumnos Inscritos" :modal="true" style="width: 50vw">
        <DataTable :value="studentsInCourse" emptyMessage="No hay alumnos inscritos aún en este curso.">
            <Column field="name" header="Nombre del Estudiante"></Column>
            <Column field="document" header="Documento"></Column>
        </DataTable>
        <template #footer>
            <Button label="Cerrar" icon="pi pi-check" @click="studentListVisible = false" />
        </template>
    </Dialog>

  </div>
</template>