/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  roleName?: string;
  isActive: boolean;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
  createdAt?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | null;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  courseCount?: number;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  categoryId: number;
  price?: number;
  durationHours?: number;
  lectures?: number;
  startAt?: string;
  endAt?: string;
  thumbnailPath?: string;
  categoryName?: string;
  instructorName?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrollmentDate: string;
  paymentDate?: string;
  paymentStatus: PaymentStatus;
  status: EnrollmentStatus;
  courseTitle?: string;
  userName?: string;
  amount?: number;
  transactionId?: string;
}

export interface AuthResponse {
  userId: number;
  name: string;
  email: string;
  role: string;
  token: string;
  expiresAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  categoryId: number;
  price?: number;
  durationHours?: number;
  lectures?: number;
  startAt?: string;
  endAt?: string;
  thumbnailPath?: string;
}

export interface CourseUpdateRequest extends Partial<CourseCreateRequest> {
  isActive?: boolean;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
}

export interface CategoryUpdateRequest extends CategoryCreateRequest {}

export interface EnrollmentCreateRequest {
  courseId: number;
  userId: number;
  amount?: number;
  paymentStatus?: PaymentStatus;
}

export const PaymentStatus = {
  Pending: 1,
  Completed: 2,
  Failed: 3,
  Refunded: 4,
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const EnrollmentStatus = {
  Active: 1,
  Completed: 2,
  Cancelled: 3,
  Dropped: 4,
} as const;
export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const UserRole = {
  Admin: 1,
  User: 2,
  Instructor: 3,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
