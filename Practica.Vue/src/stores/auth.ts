import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        userRole: localStorage.getItem('role') || null,
        username: localStorage.getItem('username') || null
    }),
    actions: {
        async login(credentials: any) {
            try {
                const response = await api.post('/auth/login', credentials);
                const { accessToken, role, username } = response.data;

                // Guardar en el estado
                this.token = accessToken;
                this.userRole = role;
                this.username = username;

                // Guardar en persistencia local
                localStorage.setItem('token', accessToken);
                localStorage.setItem('role', role);
                localStorage.setItem('username', username);

                // Redirigir según el rol
                if (role === 'Admin') router.push('/admin');
                else if (role === 'Teacher') router.push('/teacher');
                else router.push('/student');

            } catch (error) {
                console.error("Error en login:", error);
                throw error;
            }
        },
        logout() {
            this.token = null;
            this.userRole = null;
            localStorage.clear();
            router.push('/');
        }
    }
});