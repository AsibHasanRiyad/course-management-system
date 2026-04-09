/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, Course } from "@/type";
import apiClient from "../utils/axios";

export const courseApi = {
  getAll: () => apiClient.get<ApiResponse<Course[]>>("/api/Courses"),
  getById: (id: number) =>
    apiClient.get<ApiResponse<Course>>(`/api/Courses/${id}`),
  getByCategory: (categoryId: number) =>
    apiClient.get<ApiResponse<Course[]>>(`/api/Courses/category/${categoryId}`),
  create: (data: any) =>
    apiClient.post<ApiResponse<Course>>("/api/Courses", data),
  update: (id: number, data: any) =>
    apiClient.put<ApiResponse<Course>>(`/api/Courses/${id}`, data),
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/Courses/${id}`),
};
