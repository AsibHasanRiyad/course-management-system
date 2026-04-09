/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AuthResponse } from "@/type";
import apiClient from "../utils/axios";

export const authApi = {
  login: (data: any) => apiClient.post<AuthResponse>("/api/Auth/login", data),
  register: (data: any) => apiClient.post("/api/Auth/register", data),
};
