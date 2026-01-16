import { defineStore } from 'pinia';
import api from '../services/api';
import type { LoginDto, AuthResponse } from '../models/Auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null as string | null,
        refreshToken: localStorage.getItem('refreshToken') || null as string | null,
        userRole: localStorage.getItem('role') || null as string | null,
        username: localStorage.getItem('username') || null as string | null,
        userId: localStorage.getItem('userId') || null as string | null
    }),
    actions: {
        async login(credentials: LoginDto) {
            const { data } = await api.post<AuthResponse>('/auth/login', credentials);
            
            // Guardamos todo lo que nos devuelve el DTO
            this.token = data.accessToken;
            this.refreshToken = data.refreshToken;
            this.userRole = data.role;
            this.username = data.username;
            this.userId = data.id.toString();

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userId', this.userId);
        },
        logout() {
            this.token = null;
            this.refreshToken = null;
            this.userRole = null;
            localStorage.clear();
        }
    }
});