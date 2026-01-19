<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../services/api';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Select from 'primevue/select';

// --- ESTADOS ---
const currentTab = ref('students');
const students = ref([]);
const teachers = ref([]);
const courses = ref([]);

// Visibilidad de Modales
const studentDialog = ref(false);
const teacherDialog = ref(false);
const courseDialog = ref(false);

const isEditing = ref(false); // Para saber si estamos editando
const selectedId = ref<number | null>(null);

const studentForm = ref({ fullName: '', document: '', email: '', username: '', password: 'Student123*' });
const teacherForm = ref({ name: '', subject: '', email: '' });
const courseForm = ref({ name: '', status: 'Activo', teacherId: null as number | null });

// --- LÓGICA DE CARGA ---
const fetchData = async () => {
    try {
        if (currentTab.value === 'students') {
            const { data } = await api.get('/students');
            students.value = data;
        } else if (currentTab.value === 'teachers') {
            const { data } = await api.get('/teachers');
            teachers.value = data;
        } else if (currentTab.value === 'courses') {
            const { data } = await api.get('/courses');
            courses.value = data;
        }
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
};

watch(currentTab, fetchData);

// --- FUNCIONES PARA ABRIR MODALES ---
const openStudentModal = () => {
    isEditing.value = false;
    selectedId.value = null;
    studentForm.value = { fullName: '', document: '', email: '', username: '', password: 'Student123*' };
    studentDialog.value = true;
};

const openTeacherModal = () => {
    teacherForm.value = { name: '', subject: '', email: '' };
    teacherDialog.value = true;
};

const openCourseModal = async () => {
    const { data } = await api.get('/teachers');
    teachers.value = data;
    courseForm.value = { name: '', status: 'Activo', teacherId: null };
    courseDialog.value = true;
};

// --- FUNCIÓN DE GUARDADO (CORREGIDA) ---
const saveStudent = async () => {
    try {
        // Creamos el objeto que espera el Backend (StudentInputDto)
        // Asegúrate de que los nombres coincidan con tu DTO de C#
        const payload = {
            name: studentForm.value.fullName,
            document: studentForm.value.document,
            email: studentForm.value.email
        };

        if (isEditing.value && selectedId.value) {
            await api.put(`/students/${selectedId.value}`, payload);
        } else {
            await api.post('/students', studentForm.value);
        }
        
        studentDialog.value = false;
        fetchData();
    } catch (error) {
        console.error("Error al guardar estudiante:", error);
        alert("No se pudo guardar la información.");
    }
};

const saveTeacher = async () => {
    await api.post('/teachers', teacherForm.value);
    teacherDialog.value = false;
    fetchData();
};

const saveCourse = async () => {
    await api.post('/courses', courseForm.value);
    courseDialog.value = false;
    fetchData();
};

// --- FUNCIÓN DE ELIMINACIÓN GENÉRICA ---
const deleteItem = async (type: 'student' | 'teacher' | 'course', id: number) => {
    if (confirm(`¿Estás seguro de eliminar este registro?`)) {
        try {
            await api.delete(`/${type}s/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
};

// --- FUNCIÓN DE EDICIÓN (CORREGIDA) ---
const editStudent = (data: any) => {
    isEditing.value = true;
    selectedId.value = data.id;

    studentForm.value = { 
        fullName: data.name, 
        document: data.document, 
        email: data.email,
        username: data.username || '', // Mantenemos el username si existe
        password: '' 
    };
    studentDialog.value = true;
};

onMounted(fetchData);
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Panel de Administración</h1>
    
    <Tabs v-model:value="currentTab">
        <TabList>
            <Tab value="students">Estudiantes</Tab>
            <Tab value="teachers">Profesores</Tab>
            <Tab value="courses">Cursos</Tab>
        </TabList>

        <TabPanels>
            <TabPanel value="students">
                <div class="flex justify-between mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Lista de Estudiantes</h2>
                    <Button label="Nuevo Estudiante" icon="pi pi-plus" @click="openStudentModal" />
                </div>
                <DataTable :value="students" paginator :rows="5" responsiveLayout="scroll">
                    <Column field="name" header="Nombre Completo"></Column> 
                    <Column field="email" header="Email"></Column>
                    <Column field="document" header="Documento"></Column>
                    <Column header="Acciones">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" severity="warn" text @click="editStudent(slotProps.data)" />
                                <Button icon="pi pi-trash" severity="danger" text @click="deleteItem('student', slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>

            <TabPanel value="teachers">
                <div class="flex justify-between mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Lista de Docentes</h2>
                    <Button label="Nuevo Profesor" icon="pi pi-plus" severity="success" @click="openTeacherModal" />
                </div>
                <DataTable :value="teachers" paginator :rows="5">
                    <Column field="name" header="Nombre"></Column>
                    <Column field="subject" header="Materia"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" severity="danger" text @click="deleteItem('teacher', slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>

            <TabPanel value="courses">
                <div class="flex justify-between mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Catálogo Global</h2>
                    <Button label="Nuevo Curso" icon="pi pi-book" severity="help" @click="openCourseModal" />
                </div>
                <DataTable :value="courses" paginator :rows="5">
                    <Column field="name" header="Curso"></Column>
                    <Column field="teacherName" header="Profesor"></Column>
                    <Column field="status" header="Estado">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="slotProps.data.status === 'Activo' ? 'success' : 'warn'" />
                        </template>
                    </Column>
                    <Column header="Acciones">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" severity="danger" text @click="deleteItem('course', slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>
        </TabPanels>
    </Tabs>

    <Dialog v-model:visible="studentDialog" :header="isEditing ? 'Editar Estudiante' : 'Registrar Estudiante'" :modal="true" style="width: 450px">
        <div class="flex flex-col gap-4 py-2">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold">Nombre Completo</label>
                <InputText v-model="studentForm.fullName" placeholder="Ej: Juan Pérez" />
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold">Documento</label>
                <InputText v-model="studentForm.document" placeholder="Cédula o ID" />
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold">Email</label>
                <InputText v-model="studentForm.email" placeholder="correo@ejemplo.com" />
            </div>
            <div v-if="!isEditing" class="flex flex-col gap-1">
                <label class="text-sm font-bold">Usuario de Login</label>
                <InputText v-model="studentForm.username" placeholder="juan.perez" />
            </div>
            <Button :label="isEditing ? 'Actualizar' : 'Guardar Estudiante'" 
                    :icon="isEditing ? 'pi pi-refresh' : 'pi pi-save'" 
                    @click="saveStudent" class="mt-2" />
        </div>
    </Dialog>

    <Dialog v-model:visible="teacherDialog" header="Registrar Profesor" :modal="true" style="width: 450px">
        <div class="flex flex-col gap-4 py-2">
            <InputText v-model="teacherForm.name" placeholder="Nombre completo" />
            <InputText v-model="teacherForm.subject" placeholder="Materia o Especialidad" />
            <InputText v-model="teacherForm.email" placeholder="Correo electrónico" />
            <Button label="Guardar Profesor" icon="pi pi-save" severity="success" @click="saveTeacher" />
        </div>
    </Dialog>

    <Dialog v-model:visible="courseDialog" header="Crear Nuevo Curso" :modal="true" style="width: 450px">
        <div class="flex flex-col gap-4 py-2">
            <InputText v-model="courseForm.name" placeholder="Nombre del curso" />
            <Select v-model="courseForm.teacherId" :options="teachers" optionLabel="name" optionValue="id" placeholder="Asignar Profesor" />
            <Button label="Crear Curso" icon="pi pi-check" severity="help" @click="saveCourse" />
        </div>
    </Dialog>
  </div>
</template>