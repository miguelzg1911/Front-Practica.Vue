import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import TeacherDashboard from '../views/TeacherDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  // Rutas privadas (Dentro del Layout)
  {
    path: '/dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'admin', component: AdminDashboard, meta: { role: 'Admin' } },
      { path: 'teacher', component: TeacherDashboard, meta: { role: 'Teacher' } },
      { path: 'student', component: StudentDashboard, meta: { role: 'Student' } },
      { path: 'courses', component: () => import('../views/CourseView.vue') },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  if (token && (to.path === '/' || to.path === '/register')) {
     if (userRole === 'Admin') return next('/dashboard/admin');
     if (userRole === 'Teacher') return next('/dashboard/teacher');
     return next('/dashboard/student');
  }

  if (to.meta.role && to.meta.role !== userRole) {
    alert("No tienes permisos");
    return next('/'); 
  }

  next();
});

export default router;