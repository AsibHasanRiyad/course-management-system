/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, Category } from "@/type";
import apiClient from "../utils/axios";

export const categoryApi = {
  getAll: () => apiClient.get<ApiResponse<Category[]>>("/api/Categories"),
  getById: (id: number) =>
    apiClient.get<ApiResponse<Category>>(`/api/Categories/${id}`),
  create: (data: any) =>
    apiClient.post<ApiResponse<Category>>("/api/Categories", data),
  update: (id: number, data: any) =>
    apiClient.put<ApiResponse<Category>>(`/api/Categories/${id}`, data),
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/Categories/${id}`),
};
