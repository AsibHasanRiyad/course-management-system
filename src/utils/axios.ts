/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://register.cseconference.org",
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
