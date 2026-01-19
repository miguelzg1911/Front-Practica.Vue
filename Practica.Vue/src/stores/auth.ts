import { defineStore } from 'pinia';
import api from '../services/api';
import type { LoginDto, AuthResponse } from '../models/Auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
        // Agrupamos la info del usuario en un objeto reactivo
        user: localStorage.getItem('userId') ? {
            id: Number(localStorage.getItem('userId')),
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role')
        } : null
    }),
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