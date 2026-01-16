import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import TeacherDashboard from '../views/TeacherDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';

const routes = [
  // Rutas públicas (Sin el marco del Layout)
  { path: '/', component: Login },
  { path: '/register', component: Register },

  // Rutas privadas (Dentro del Layout)
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'), // Cargamos el marco
    children: [
      { path: 'admin', component: AdminDashboard, meta: { role: 'Admin' } },
      { path: 'teacher', component: TeacherDashboard, meta: { role: 'Teacher' } },
      { path: 'student', component: StudentDashboard, meta: { role: 'Student' } },
      { path: 'courses', component: () => import('../views/CourseView.vue') },
    ],
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARDIA DE SEGURIDAD
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // "Admin", "Teacher" o "Student"

  // 1. Si la ruta requiere autenticación y no hay token, al Login
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' });
  }

  // 2. Si la ruta pide un rol específico y el usuario no lo tiene, al Login (o a una página de error)
  if (to.meta.role && to.meta.role !== userRole) {
    alert("No tienes permisos para acceder a esta sección");
    return next({ name: 'Login' });
  }

  next();
});

export default router;