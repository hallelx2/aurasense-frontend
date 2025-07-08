import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Create base axios instance
export const apiClient = axios.create({
  baseURL: '/api', // This will route through Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors (unauthorized) here if needed
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      console.warn('Unauthorized request:', error.config.url);
    }
    return Promise.reject(error);
  }
);
