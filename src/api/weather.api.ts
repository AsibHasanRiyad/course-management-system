import type { WeatherForecast } from "@/type";
import apiClient from "../utils/axios";

export const weatherApi = {
  getForecast: () => apiClient.get<WeatherForecast[]>("/WeatherForecast"),
};
