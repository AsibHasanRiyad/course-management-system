/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Course } from "@/type";
import apiClient from "../utils/axios";

export const courseApi = {
  getAll: () => apiClient.get<Course[]>("/api/Courses"),
  getById: (id: number) => apiClient.get<Course>(`/api/Courses/${id}`),
  getByCategory: (categoryId: number) =>
    apiClient.get<Course[]>(`/api/Courses/category/${categoryId}`),
  create: (data: any) => apiClient.post("/api/Courses", data),
  update: (id: number, data: any) => apiClient.put(`/api/Courses/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/Courses/${id}`),
};
