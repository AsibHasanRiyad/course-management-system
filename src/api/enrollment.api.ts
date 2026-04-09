/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Enrollment } from "@/type";
import apiClient from "../utils/axios";

export const enrollmentApi = {
  getAll: () => apiClient.get<Enrollment[]>("/api/Enrollments"),
  getById: (id: number) => apiClient.get<Enrollment>(`/api/Enrollments/${id}`),
  getByUser: (userId: number) =>
    apiClient.get<Enrollment[]>(`/api/Enrollments/user/${userId}`),
  getByCourse: (courseId: number) =>
    apiClient.get<Enrollment[]>(`/api/Enrollments/course/${courseId}`),
  create: (data: any) => apiClient.post("/api/Enrollments", data),
  update: (id: number, data: any) =>
    apiClient.put(`/api/Enrollments/${id}`, data),
  delete: (id: number) => apiClient.delete(`/api/Enrollments/${id}`),
};
