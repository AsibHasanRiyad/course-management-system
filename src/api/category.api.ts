/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Category } from "@/type";
import apiClient from "../utils/axios";

export const categoryApi = {
  getAll: () => apiClient.get<Category[]>("/api/Categories"),
  getById: (id: number) => apiClient.get<Category>(`/api/Categories/${id}`),
  create: (data: any) => apiClient.post("/api/Categories", data),
  update: (id: number, data: any) =>
    apiClient.put(`/api/Categories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/Categories/${id}`),
};
