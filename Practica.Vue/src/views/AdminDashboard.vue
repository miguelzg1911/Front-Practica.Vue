<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '../services/api';

// Imports de PrimeVue
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

const studentDialog = ref(false);
const teacherDialog = ref(false);
const courseDialog = ref(false);

const isEditing = ref(false); 
const selectedId = ref<number | null>(null);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// --- FORMULARIOS ---
const studentForm = ref({ fullName: '', document: '', email: '', username: '', password: '' });
const teacherForm = ref({ name: '', subject: '', email: '', document: ''});
const courseForm = ref({ name: '', status: 'Activo', teacherId: null as number | null, imageUrl: '' });

// --- CARGA DE DATOS ---
const fetchData = async () => {
    try {
        const { data } = await api.get(`/${currentTab.value}`);
        if (currentTab.value === 'students') students.value = data;
        else if (currentTab.value === 'teachers') teachers.value = data;
        else if (currentTab.value === 'courses') courses.value = data;
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
};

watch(currentTab, fetchData);

// --- LÓGICA DE IMAGEN ---
const onFileSelect = async (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploading.value = true;
    try {
        const { data } = await api.post('/upload/image', formData);
        courseForm.value.imageUrl = data.url;
    } catch (error) {
        alert("Error al subir imagen");
    } finally {
        uploading.value = false;
    }
};

// --- FUNCIONES DE APERTURA ---
const openStudentModal = () => {
    isEditing.value = false;
    studentForm.value = { fullName: '', document: '', email: '', username: '', password: '' };
    studentDialog.value = true;
};

const openTeacherModal = () => {
    isEditing.value = false;
    teacherForm.value = { name: '', subject: '', email: '', document: '' };
    teacherDialog.value = true;
};

const openCourseModal = async () => {
    const { data } = await api.get('/teachers');
    teachers.value = data;
    isEditing.value = false;
    courseForm.value = { name: '', status: 'Activo', teacherId: null, imageUrl: '' };
    courseDialog.value = true;
};

// --- FUNCIONES DE EDICIÓN ---
const editStudent = (data: any) => {
    isEditing.value = true;
    selectedId.value = data.id;
    studentForm.value = { fullName: data.name, document: data.document, email: data.email, username: data.username, password: '' };
    studentDialog.value = true;
};

const editTeacher = (data: any) => {
    isEditing.value = true;
    selectedId.value = data.id;
    teacherForm.value = { name: data.name, subject: data.subject, email: data.email, document: data.document };
    teacherDialog.value = true;
};

const editCourse = async (data: any) => {
    const res = await api.get('/teachers');
    teachers.value = res.data;
    isEditing.value = true;
    selectedId.value = data.id;
    courseForm.value = { ...data };
    courseDialog.value = true;
};

// --- FUNCIONES DE GUARDADO ---
const saveStudent = async () => {
    try {
        const payload = isEditing.value 
            ? { name: studentForm.value.fullName, document: studentForm.value.document, email: studentForm.value.email }
            : { ...studentForm.value, name: studentForm.value.fullName, password: studentForm.value.document }; // Clave = Documento

        if (isEditing.value) await api.put(`/students/${selectedId.value}`, payload);
        else await api.post('/students', payload);
        
        studentDialog.value = false;
        fetchData();
    } catch (error) { alert("Error al guardar estudiante"); }
};

const saveTeacher = async () => {
    try {
        if (isEditing.value) {
            await api.put(`/teachers/${selectedId.value}`, teacherForm.value);
        } else {
            // El backend generará el username y usará el documento como clave
            await api.post('/teachers', teacherForm.value);
            alert(`Profesor creado. Accederá con su Email y su Documento.`);
        }
        teacherDialog.value = false;
        fetchData();
    } catch (error) { alert("Error al guardar profesor."); }
};

const saveCourse = async () => {
    try {
        if (isEditing.value) await api.put(`/courses/${selectedId.value}`, courseForm.value);
        else await api.post('/courses', courseForm.value);
        courseDialog.value = false;
        fetchData();
    } catch (error) { alert("Error al guardar curso."); }
};

const deleteItem = async (type: string, id: number) => {
    if (confirm(`¿Eliminar este registro?`)) {
        await api.delete(`/${type}s/${id}`);
        fetchData();
    }
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
                <div class="flex justify-between items-center mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Listado de Estudiantes</h2>
                    <Button label="Nuevo Estudiante" icon="pi pi-plus" @click="openStudentModal" />
                </div>
                <DataTable :value="students" paginator :rows="5">
                    <Column field="name" header="Nombre"></Column> 
                    <Column field="document" header="Documento"></Column>
                    <Column field="email" header="Email"></Column>
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
                <div class="flex justify-between items-center mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Listado de Docentes</h2>
                    <Button label="Nuevo Profesor" icon="pi pi-plus" severity="success" @click="openTeacherModal" />
                </div>
                <DataTable :value="teachers" paginator :rows="5">
                    <Column field="name" header="Nombre"></Column>
                    <Column field="subject" header="Materia"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column header="Acciones">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" severity="warn" text @click="editTeacher(slotProps.data)" />
                                <Button icon="pi pi-trash" severity="danger" text @click="deleteItem('teacher', slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>

            <TabPanel value="courses">
                <div class="flex justify-between items-center mb-4 mt-4">
                    <h2 class="text-xl font-semibold">Gestión de Cursos</h2>
                    <Button label="Nuevo Curso" icon="pi pi-book" severity="help" @click="openCourseModal" />
                </div>
                <DataTable :value="courses" paginator :rows="5">
                    <Column header="Portada">
                        <template #body="slotProps">
                            <img v-if="slotProps.data.imageUrl" :src="slotProps.data.imageUrl" class="w-16 h-10 object-cover rounded shadow" />
                            <i v-else class="pi pi-image text-gray-300 text-2xl"></i>
                        </template>
                    </Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="status" header="Estado">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="slotProps.data.status === 'Activo' ? 'success' : 'warn'" />
                        </template>
                    </Column>
                    <Column header="Acciones">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                                <Button icon="pi pi-pencil" severity="warn" text @click="editCourse(slotProps.data)" />
                                <Button icon="pi pi-trash" severity="danger" text @click="deleteItem('course', slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </TabPanel>
        </TabPanels>
    </Tabs>

    <Dialog v-model:visible="studentDialog" :header="isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante'" modal style="width: 400px">
        <div class="flex flex-col gap-3 py-2">
            <label class="font-bold">Nombre Completo</label>
            <InputText v-model="studentForm.fullName" />
            <label class="font-bold">Documento (Será su contraseña)</label>
            <InputText v-model="studentForm.document" />
            <label class="font-bold">Email</label>
            <InputText v-model="studentForm.email" />
            <Button :label="isEditing ? 'Actualizar' : 'Guardar'" @click="saveStudent" class="mt-2 w-full" />
        </div>
    </Dialog>

    <Dialog v-model:visible="teacherDialog" :header="isEditing ? 'Editar Profesor' : 'Registrar Profesor'" modal style="width: 400px">
        <div class="flex flex-col gap-3 py-2">
            <label class="font-bold">Nombre Completo</label>
            <InputText v-model="teacherForm.name" placeholder="Ej: Andres" />
            <label class="font-bold">Documento (Será su contraseña)</label>
            <InputText v-model="teacherForm.document" placeholder="Ej: 1234567" />
            <label class="font-bold">Materia</label>
            <InputText v-model="teacherForm.subject" placeholder="C#" />
            <label class="font-bold">Email</label>
            <InputText v-model="teacherForm.email" placeholder="andres@riwi.io" />
            <Button :label="isEditing ? 'Actualizar' : 'Guardar'" :severity="isEditing ? 'warn' : 'success'" @click="saveTeacher" class="mt-2 w-full" />
        </div>
    </Dialog>

    <Dialog v-model:visible="courseDialog" :header="isEditing ? 'Editar Curso' : 'Nuevo Curso'" modal style="width: 450px">
        <div class="flex flex-col gap-4 py-2">
            <div class="flex flex-col items-center gap-2 border-b pb-4">
                <img v-if="courseForm.imageUrl" :src="courseForm.imageUrl" class="w-32 h-20 object-cover rounded shadow" />
                <input type="file" ref="fileInput" class="hidden" @change="onFileSelect" />
                <Button :label="uploading ? 'Subiendo...' : 'Cambiar Imagen'" icon="pi pi-image" text @click="fileInput?.click()" />
            </div>
            <InputText v-model="courseForm.name" placeholder="Nombre del curso" class="w-full" />
            <Select v-model="courseForm.teacherId" :options="teachers" optionLabel="name" optionValue="id" placeholder="Asignar Profesor" class="w-full" />
            <Button :label="isEditing ? 'Actualizar' : 'Crear'" severity="help" @click="saveCourse" :disabled="uploading" class="w-full" />
        </div>
    </Dialog>
  </div>
</template>