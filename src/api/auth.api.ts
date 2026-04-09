/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, AuthResponse } from "@/type";
import apiClient from "../utils/axios";

export const authApi = {
  login: (data: any) =>
    apiClient.post<ApiResponse<AuthResponse>>("/api/Auth/login", data),
  register: (data: any) =>
    apiClient.post<ApiResponse<null>>("/api/Auth/register", data),
};
