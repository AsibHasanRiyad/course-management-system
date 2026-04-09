/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, User } from "@/type";
import apiClient from "../utils/axios";

export const userApi = {
  getAll: () => apiClient.get<ApiResponse<User[]>>("/api/Users"),
  getById: (id: number) => apiClient.get<ApiResponse<User>>(`/api/Users/${id}`),
  update: (id: number, data: any) =>
    apiClient.put<ApiResponse<User>>(`/api/Users/${id}`, data),
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/Users/${id}`),
};
