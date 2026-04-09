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
import CoursesPage from "@/pages/dashboard/Courses";

// Placeholder for missing pages
const EnrollmentsPage = () => (
  <div className="container mx-auto px-4 py-10">Enrollments Page</div>
);
const UsersPage = () => (
  <div className="container mx-auto px-4 py-10">Users Page</div>
);

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
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}
