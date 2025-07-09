import apiClient from './axios';
import { AuthResponse } from '@/types/auth';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get<AuthResponse>('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<RegisterData>) {
    const response = await apiClient.patch<AuthResponse>('/auth/me', data);
    return response.data;
  },

  async updateOnboardingStatus(isOnboarded: boolean) {
    const response = await apiClient.patch<AuthResponse>('/auth/me', { isOnboarded });
    return response.data;
  }
};
