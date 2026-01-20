import { defineStore } from 'pinia';
import api from '../services/api';
import type { LoginDto, AuthResponse } from '../models/Auth';

interface User {
    id: number;
    username: string;
    role: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('userId') ? {
            id: Number(localStorage.getItem('userId')),
            username: localStorage.getItem('username') || '',
            role: localStorage.getItem('role') || ''
        } as User : null as User | null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role || '',
        username: (state) => state.user?.username || 'Usuario'
    },

    actions: {
        async login(credentials: LoginDto) {
            const { data } = await api.post<AuthResponse>('/auth/login', credentials);
            
            this.token = data.accessToken;
            this.refreshToken = data.refreshToken;

            this.user = {
                id: data.id,
                username: data.username,
                role: data.role
            };

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', data.id.toString());
        },
        logout() {
            this.token = null;
            this.refreshToken = null;
            this.user = null;
            localStorage.clear();
        }
    }
});