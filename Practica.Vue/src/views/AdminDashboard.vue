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
import Card from 'primevue/card';

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
    try {
        const { data } = await api.get('/teachers');
        teachers.value = data;
        isEditing.value = false;
        courseForm.value = { name: '', status: 'Activo', teacherId: null, imageUrl: '' };
        courseDialog.value = true;
    } catch (error) {
        alert("Error al cargar lista de profesores");
    }
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
    try {
        const res = await api.get('/teachers');
        teachers.value = res.data;
        isEditing.value = true;
        selectedId.value = data.id;
        courseForm.value = { ...data };
        courseDialog.value = true;
    } catch (error) {
        alert("Error al editar curso");
    }
};

// --- FUNCIONES DE GUARDADO ---
const saveStudent = async () => {
    try {
        const payload = isEditing.value 
            ? { name: studentForm.value.fullName, document: studentForm.value.document, email: studentForm.value.email, username: studentForm.value.username }
            : { ...studentForm.value, name: studentForm.value.fullName, password: studentForm.value.document };

        if (isEditing.value) await api.put(`/students/${selectedId.value}`, payload);
        else await api.post('/students', payload);
        
        studentDialog.value = false;
        fetchData();
    } catch (error) { alert("Error al guardar estudiante"); }
};

const saveTeacher = async () => {
    try {
        const payload = isEditing.value 
            ? { ...teacherForm.value }
            : { ...teacherForm.value, password: teacherForm.value.document };

        if (isEditing.value) await api.put(`/teachers/${selectedId.value}`, payload);
        else await api.post('/teachers', payload);
        
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
    if (confirm(`¿Estás seguro de eliminar este registro?`)) {
        try {
            await api.delete(`/${type}s/${id}`);
            fetchData();
        } catch (error) {
            alert("Error al eliminar el registro.");
        }
    }
};

onMounted(fetchData);
</script>

<template>
  <div class="w-full">
    <div class="mb-8 ml-2">
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Panel de Administración</h1>
      <p class="text-slate-500 font-medium text-sm">Gestiona estudiantes, profesores y cursos de la academia</p>
    </div>

    <Card class="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
      <template #content>
        <Tabs v-model:value="currentTab" class="w-full">
          <TabList class="mb-6 border-b border-slate-100 px-4">
            <Tab value="students" class="font-bold py-4 px-6"><i class="pi pi-users mr-2"></i>Estudiantes</Tab>
            <Tab value="teachers" class="font-bold py-4 px-6"><i class="pi pi-briefcase mr-2"></i>Profesores</Tab>
            <Tab value="courses" class="font-bold py-4 px-6"><i class="pi pi-book mr-2"></i>Cursos</Tab>
          </TabList>

          <TabPanels class="p-4">
            <TabPanel value="students">
                <div class="flex justify-between items-center mb-6 px-4">
                <h3 class="text-xl font-bold text-slate-700">Listado de Estudiantes</h3>
                <Button label="Nuevo Estudiante" icon="pi pi-plus" @click="openStudentModal" 
                        class="bg-blue-600 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg" />
                </div>
                
                <DataTable :value="students" paginator :rows="8" class="p-datatable-sm w-full" tableStyle="table-layout: fixed;">
                <Column field="name" header="NOMBRE" sortable class="px-4 py-4 font-semibold text-slate-700" style="width: 35%"></Column> 
                <Column field="document" header="DOCUMENTO" headerClass="justify-center" class="text-center" style="width: 20%"></Column>
                <Column field="email" header="EMAIL" headerClass="justify-center" class="text-center" style="width: 30%"></Column>
                <Column header="ACCIONES" headerClass="justify-center" class="text-center" style="width: 15%">
                    <template #body="slotProps">
                        <div class="flex gap-4 justify-center items-center">
                            <button @click="editStudent(slotProps.data)" class="text-amber-500 hover:scale-125 transition-all"><i class="pi pi-pencil"></i></button>
                            <button @click="deleteItem('student', slotProps.data.id)" class="text-red-500 hover:scale-125 transition-all"><i class="pi pi-trash"></i></button>
                        </div>
                    </template>
                </Column>
                </DataTable>
            </TabPanel>

            <TabPanel value="teachers">
                <div class="flex justify-between items-center mb-6 px-4">
                <h3 class="text-xl font-bold text-slate-700">Listado de Docentes</h3>
                <Button label="Nuevo Profesor" icon="pi pi-plus" @click="openTeacherModal" 
                        class="bg-emerald-600 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg" />
                </div>
                
                <DataTable :value="teachers" paginator :rows="8" class="p-datatable-sm w-full" tableStyle="table-layout: fixed;">
                <Column field="name" header="NOMBRE" sortable class="px-4 py-4 font-semibold text-slate-700" style="width: 35%"></Column> 
                <Column field="subject" header="MATERIA" headerClass="justify-center" class="text-center" style="width: 20%">
                    <template #body="slotProps">
                    <Tag :value="slotProps.data.subject" severity="secondary" class="rounded-lg px-3 bg-slate-100 text-slate-600 border-0" />
                    </template>
                </Column>
                <Column field="email" header="EMAIL" headerClass="justify-center" class="text-center" style="width: 30%"></Column>
                <Column header="ACCIONES" headerClass="justify-center" class="text-center" style="width: 15%">
                    <template #body="slotProps">
                        <div class="flex gap-4 justify-center items-center">
                            <button @click="editTeacher(slotProps.data)" class="text-amber-500 hover:scale-125 transition-all"><i class="pi pi-pencil"></i></button>
                            <button @click="deleteItem('teacher', slotProps.data.id)" class="text-red-500 hover:scale-125 transition-all"><i class="pi pi-trash"></i></button>
                        </div>
                    </template>
                </Column>
                </DataTable>
            </TabPanel>

            <TabPanel value="courses">
                <div class="flex justify-between items-center mb-6 px-4">
                <h3 class="text-xl font-bold text-slate-700">Gestión de Cursos</h3>
                <Button label="Nuevo Curso" icon="pi pi-book" @click="openCourseModal" 
                        class="bg-violet-600 text-white border-0 rounded-xl px-6 py-3 font-bold shadow-lg" />
                </div>
                
                <DataTable :value="courses" paginator :rows="8" class="p-datatable-sm w-full" tableStyle="table-layout: fixed;">
                <Column header="VISTA PREVIA" headerClass="justify-center" class="text-center" style="width: 15%">
                    <template #body="slotProps">
                    <img :src="slotProps.data.imageUrl || 'https://via.placeholder.com/150'" class="w-12 h-8 object-cover rounded shadow-sm mx-auto" />
                    </template>
                </Column>
                <Column field="name" header="NOMBRE DEL CURSO" sortable class="font-semibold text-slate-700" style="width: 50%"></Column> 
                <Column field="status" header="ESTADO" headerClass="justify-center" class="text-center" style="width: 15%">
                    <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="slotProps.data.status === 'Activo' ? 'success' : 'warn'" rounded />
                    </template>
                </Column>
                <Column header="ACCIONES" headerClass="justify-center" class="text-center" style="width: 20%">
                    <template #body="slotProps">
                    <div class="flex gap-4 justify-center items-center">
                        <button @click="editCourse(slotProps.data)" class="text-amber-500 hover:scale-125 transition-all"><i class="pi pi-pencil"></i></button>
                        <button @click="deleteItem('course', slotProps.data.id)" class="text-red-500 hover:scale-125 transition-all"><i class="pi pi-trash"></i></button>
                    </div>
                    </template>
                </Column>
                </DataTable>
            </TabPanel>
            </TabPanels>
        </Tabs>
      </template>
    </Card>

    <Dialog v-model:visible="studentDialog" :header="isEditing ? '✏️ Editar Estudiante' : '👤 Nuevo Estudiante'" modal 
            class="mx-4 w-full max-w-lg border-0 shadow-2xl" :pt="{ mask: { class: 'backdrop-blur-sm' } }">
      <div class="p-8 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
          <InputText v-model="studentForm.fullName" placeholder="Ej: Juan Pérez García" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Documento</label>
            <InputText v-model="studentForm.document" placeholder="Número de ID" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
            <InputText v-model="studentForm.username" placeholder="Ej: JuanP123" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <InputText v-model="studentForm.email" placeholder="correo@academia.com" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <div v-if="!isEditing" class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
          <i class="pi pi-info-circle text-blue-500 mt-1"></i>
          <p class="text-xs text-blue-700 leading-tight"><strong>Nota:</strong> La contraseña inicial será el documento.</p>
        </div>
        <Button :label="isEditing ? 'Actualizar Información' : 'Registrar Estudiante'" @click="saveStudent" 
                class="mt-4 w-full py-4 font-bold bg-blue-600 text-white border-0 rounded-2xl shadow-lg" />
      </div>
    </Dialog>

    <Dialog v-model:visible="teacherDialog" :header="isEditing ? '✏️ Editar Docente' : '👨‍🏫 Nuevo Docente'" modal class="mx-4 w-full max-w-lg border-0 shadow-2xl">
      <div class="p-8 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre del Profesor</label>
          <InputText v-model="teacherForm.name" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Documento</label>
            <InputText v-model="teacherForm.document" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Materia</label>
            <InputText v-model="teacherForm.subject" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <InputText v-model="teacherForm.email" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <Button :label="isEditing ? 'Actualizar Docente' : 'Registrar Docente'" @click="saveTeacher" class="mt-4 w-full py-4 font-bold bg-emerald-600 text-white border-0 rounded-2xl shadow-lg" />
      </div>
    </Dialog>

    <Dialog v-model:visible="courseDialog" :header="isEditing ? '✏️ Editar Curso' : '📚 Nuevo Curso'" modal class="mx-4 w-full max-w-lg border-0 shadow-2xl">
      <div class="p-8 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre del Curso</label>
          <InputText v-model="courseForm.name" class="w-full h-12 px-5 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profesor Asignado</label>
          <Select v-model="courseForm.teacherId" :options="teachers" optionLabel="name" optionValue="id" placeholder="Seleccione un profesor" class="w-full rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Imagen del Curso</label>
          <div class="flex items-center gap-4">
            <img :src="courseForm.imageUrl || 'https://via.placeholder.com/150'" class="w-20 h-20 object-cover rounded-2xl border shadow-sm" />
            <div class="flex-1">
               <input type="file" @change="onFileSelect" class="hidden" id="file-upload" accept="image/*" />
               <label for="file-upload" class="cursor-pointer bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-2">
                 <i class="pi pi-upload"></i> {{ uploading ? 'Subiendo...' : 'Subir Imagen' }}
               </label>
            </div>
          </div>
        </div>
        <Button :label="isEditing ? 'Actualizar Curso' : 'Crear Curso'" @click="saveCourse" class="mt-4 w-full py-4 font-bold bg-violet-600 text-white border-0 rounded-2xl shadow-lg" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/* 1. Reset de encabezados: Fondo gris claro y texto alineado */
:deep(.p-datatable-thead > tr > th) {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-size: 0.75rem;
  padding: 1rem !important;
  border-bottom: 1px solid #e2e8f0;
}

/* 2. Alineación del contenido del encabezado (Clave para el centrado) */
:deep(.p-column-header-content) {
  display: flex !important;
  align-items: center !important;
}

:deep(.justify-center .p-column-header-content) {
  justify-content: center !important;
}

/* 3. Estilo de las celdas del cuerpo */
:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem !important;
  border-bottom: 1px solid #f1f5f9;
  /* Evita que el texto largo rompa la fila */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 4. Efecto hover en las filas */
:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8fafc !important;
}

/* 5. Asegurar que los botones de acción se vean bien */
.flex.gap-4.justify-center.items-center {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

:deep(.p-tabs-tab-active) {
  color: #2563eb !important;
}
</style>