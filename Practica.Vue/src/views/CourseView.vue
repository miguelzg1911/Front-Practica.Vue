<template>
  <div class="courses-container">
    <div class="header">
      <h1>Catálogo de Cursos</h1>
      <button v-if="authStore.userRole !== 'Student'" @click="showModal = true" class="btn-add">
        + Crear Nuevo Curso
      </button>
    </div>

    <div class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <h3>{{ course.name }}</h3>
        <p>{{ course.description }}</p>
        <span class="teacher-name">Dictado por: {{ course.teacherName }}</span>
        
        <div class="actions">
          <button v-if="authStore.userRole === 'Student'" @click="enroll(course.id)">
            Inscribirme
          </button>
          <button v-if="authStore.userRole === 'Admin'" @click="deleteCourse(course.id)" class="btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

// Definir la forma del curso
interface Course {
  id: number;
  name: string;
  description: string;
  teacherName: string;
}

const authStore = useAuthStore();

// Tipar el ref explícitamente como un array de Cursos
const courses = ref<Course[]>([]); 
const showModal = ref(false);

const fetchCourses = async () => {
  try {
    const { data } = await api.get<Course[]>('/courses');
    courses.value = data;
  } catch (error) {
    console.error("Error cargando cursos", error);
  }
};

const enroll = async (courseId: number) => {
  await api.post(`/courses/${courseId}/enroll`);
  alert("Inscripción exitosa");
};

// Crear la función deleteCourse que te faltaba en el script
const deleteCourse = async (courseId: number) => {
  if (confirm("¿Estás seguro de eliminar este curso?")) {
    try {
      await api.delete(`/courses/${courseId}`);
      await fetchCourses(); // Recargar lista
    } catch (error) {
      alert("Error al eliminar");
    }
  }
};

onMounted(fetchCourses);
</script>