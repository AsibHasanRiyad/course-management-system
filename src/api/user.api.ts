/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "@/type";
import apiClient from "../utils/axios";

export const userApi = {
  getAll: () => apiClient.get<User[]>("/api/Users"),
  getById: (id: number) => apiClient.get<User>(`/api/Users/${id}`),
  update: (id: number, data: any) => apiClient.put(`/api/Users/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/Users/${id}`),
};
