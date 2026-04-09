import type {
  ApiResponse,
  Enrollment,
  EnrollmentCreateRequest,
  EnrollmentUpdateRequest,
} from "@/type";
import apiClient from "../utils/axios";

export const enrollmentApi = {
  getAll: () => apiClient.get<ApiResponse<Enrollment[]>>("/api/Enrollments"),
  getById: (id: number) =>
    apiClient.get<ApiResponse<Enrollment>>(`/api/Enrollments/${id}`),
  getByUser: (userId: number) =>
    apiClient.get<ApiResponse<Enrollment[]>>(`/api/Enrollments/user/${userId}`),
  getByCourse: (courseId: number) =>
    apiClient.get<ApiResponse<Enrollment[]>>(
      `/api/Enrollments/course/${courseId}`,
    ),
  create: (data: EnrollmentCreateRequest) =>
    apiClient.post<ApiResponse<Enrollment>>("/api/Enrollments", data),
  update: (id: number, data: EnrollmentUpdateRequest) =>
    apiClient.put<ApiResponse<Enrollment>>(`/api/Enrollments/${id}`, data),
  delete: (id: number) =>
    apiClient.delete<ApiResponse<null>>(`/api/Enrollments/${id}`),
};
