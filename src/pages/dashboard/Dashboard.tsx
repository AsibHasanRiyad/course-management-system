import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "../../api/enrollment.api";
import { courseApi } from "../../api/course.api";
import { userApi } from "../../api/user.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  BookOpen,
  Users,
  Layers,
  Settings,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ApiResponse, Course, Enrollment, User } from "@/type";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<
    ApiResponse<Enrollment[]>
  >({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      const response = isAdmin
        ? await enrollmentApi.getAll()
        : await enrollmentApi.getByUser(user!.id);
      return response.data;
    },
    enabled: !!user,
  });

  const { data: courses } = useQuery<ApiResponse<Course[]>>({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return response.data;
    },
    enabled: isAdmin,
  });

  const { data: users } = useQuery<ApiResponse<User[]>>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    },
    enabled: isAdmin,
  });

  const enrollmentItems = enrollments?.data ?? [];
  const courseItems = courses?.data ?? [];
  const userItems = users?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Dashboard
          </h1>
          <p className="text-zinc-500">
            Welcome back, {user?.name}. Here's what's happening.
          </p>
        </div>
        {isAdmin && (
          <Button
            className="rounded-xl font-bold uppercase tracking-widest"
            asChild
          >
            <Link to="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" /> Create Course
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="rounded-xl border-2 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              {isAdmin ? "Total Enrollments" : "My Courses"}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">
              {enrollmentItems.length}
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" /> +2 from last
              month
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            <Card className="rounded-xl border-2 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">
                  {userItems.length}
                </div>
                <p className="text-xs text-zinc-400 mt-1">Active learners</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-2 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Active Courses
                </CardTitle>
                <Layers className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter">
                  {courseItems.length}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Across 5 categories
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="rounded-xl border-2 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Learning Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tighter">24.5h</div>
            <p className="text-xs text-zinc-400 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-xl border-2 shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tighter uppercase">
                {isAdmin ? "Recent Enrollments" : "My Recent Courses"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
              ) : enrollmentItems.length > 0 ? (
                <div className="space-y-6">
                  {enrollmentItems.slice(0, 5).map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-bold uppercase tracking-tight">
                          {enrollment.courseTitle ||
                            `Course #${enrollment.courseId}`}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {isAdmin
                            ? `Student: ${enrollment.userName || enrollment.userId}`
                            : `Enrolled on ${new Date(enrollment.enrollmentDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          enrollment.status === 1 ? "default" : "secondary"
                        }
                        className="rounded-xl uppercase tracking-widest text-[10px]"
                      >
                        {enrollment.status === 1 ? "Active" : "Completed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No enrollments found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-xl border-2 shadow-none bg-zinc-900 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tighter uppercase">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold uppercase tracking-widest border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white"
                asChild
              >
                <Link to="/profile">
                  <Settings className="mr-2 h-4 w-4" /> Edit Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold uppercase tracking-widest border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white"
                asChild
              >
                <Link to="/courses">
                  <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                </Link>
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-xl font-bold uppercase tracking-widest border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white"
                  asChild
                >
                  <Link to="/admin/users">
                    <Users className="mr-2 h-4 w-4" /> Manage Users
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
