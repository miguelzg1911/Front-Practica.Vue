import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import TeacherDashboard from '../views/TeacherDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'admin', component: AdminDashboard, meta: { role: 'Admin' } },
      { path: 'teacher', component: TeacherDashboard, meta: { role: 'Teacher' } },
      { path: 'student', component: StudentDashboard, meta: { role: 'Student' } },
      // Eliminamos la ruta extra de courses para evitar duplicidad
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Si intenta ir a una ruta privada sin token
  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  // Si ya está logueado e intenta ir a Login/Register, mandarlo a su panel
  if (token && (to.path === '/' || to.path === '/register')) {
    if (userRole === 'Admin') return next('/dashboard/admin');
    if (userRole === 'Teacher') return next('/dashboard/teacher');
    if (userRole === 'Student') return next('/dashboard/student');
  }

  // Protección por Roles
  if (to.meta.role && to.meta.role !== userRole) {
    alert("No tienes permisos para acceder a esta sección");
    // Lo mandamos a su panel correspondiente en lugar de al login
    if (userRole === 'Admin') return next('/dashboard/admin');
    if (userRole === 'Teacher') return next('/dashboard/teacher');
    return next('/dashboard/student');
  }

  next();
});

export default router;