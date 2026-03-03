import api from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse {
  message: string;
  user?: UserData | number;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>('/register', data);
    return response.data;
  },

  async getProfile(): Promise<{ user: UserData }> {
    const response = await api.get<{ user: UserData }>('/profile');
    return response.data;
  },

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userId');
  },
};
