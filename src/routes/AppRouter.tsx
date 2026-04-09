import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import CategoriesPage from "../pages/dashboard/Categories";
import MainLayout from "@/layout/MainLayout";
import AuthLayout from "@/layout/AuthLayout";
import HomePage from "@/pages/Home.page";
import CourseDetailPage from "@/pages/CourseDetails.page";
import ProfilePage from "@/pages/Profile.page";
import DashboardPage from "@/pages/dashboard/Dashboard";
import CreateCoursePage from "@/pages/dashboard/CreateCourse";
import ManageUsersPage from "@/pages/dashboard/ManageUsers";
import CoursesPage from "@/pages/dashboard/Courses";
import EnrollmentsPage from "../pages/dashboard/Enrollments";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin/courses/new" element={<CreateCoursePage />} />
        <Route path="admin/users" element={<ManageUsersPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Dashboard / Protected Routes */}
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="users" element={<ManageUsersPage />} />
      </Route>
    </Routes>
  );
}
