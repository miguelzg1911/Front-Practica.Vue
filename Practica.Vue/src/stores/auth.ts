import { defineStore } from 'pinia';
import api from '../services/api';
import type { LoginDto, AuthResponse } from '../models/Auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
        userRole: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId')
    }),
    actions: {
        async login(credentials: LoginDto) {
            const { data } = await api.post<AuthResponse>('/auth/login', credentials);
            
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
            this.username = null;
            this.userId = null;
            localStorage.clear();
        }
    }
});