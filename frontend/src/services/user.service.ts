import api from '../config/api';

export interface UpdateUserData {
  name: string;
  bio?: string;
  contact?: string;
}

export interface ApiResponse {
  message: string;
}

export const userService = {
  async updateUser(userId: number, data: UpdateUserData): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/updateUser/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: number): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`/deleteUser/${userId}`);
    return response.data;
  },
};
