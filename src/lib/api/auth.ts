import apiClient from './axios';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    first_name: string;
    last_name: string;
    is_onboarded: boolean;
  };
  access_token: string;
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
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<RegisterData>) {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  async updateOnboardingStatus(isOnboarded: boolean) {
    const response = await apiClient.patch('/auth/profile', { is_onboarded: isOnboarded });
    return response.data;
  }
};
