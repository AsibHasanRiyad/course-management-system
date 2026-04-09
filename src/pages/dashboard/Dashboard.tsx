import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { categoryApi } from "../../api/category.api";
import { enrollmentApi } from "../../api/enrollment.api";
import { courseApi } from "../../api/course.api";
import { userApi } from "../../api/user.api";
import { weatherApi } from "../../api/weather.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Loader2,
  BookOpen,
  Users,
  Layers,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  CloudSun,
  Thermometer,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  ApiResponse,
  Category,
  Course,
  CourseCreateRequest,
  Enrollment,
  User,
  WeatherForecast,
} from "@/type";

interface CourseFormState {
  title: string;
  description: string;
  categoryId: string;
  price: string;
  durationHours: string;
  lectures: string;
  startAt: string;
  endAt: string;
  thumbnailPath: string;
}

const initialCourseForm: CourseFormState = {
  title: "",
  description: "",
  categoryId: "",
  price: "",
  durationHours: "",
  lectures: "",
  startAt: "",
  endAt: "",
  thumbnailPath: "",
};

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [courseForm, setCourseForm] =
    useState<CourseFormState>(initialCourseForm);

  const openCreateCourseModal = () => {
    setCourseModalMode("create");
    setSelectedCourse(null);
    setCourseForm(initialCourseForm);
    setIsCourseModalOpen(true);
  };

  const openEditCourseModal = (course: Course) => {
    setCourseModalMode("edit");
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      categoryId: String(course.categoryId),
      price: String(course.price ?? ""),
      durationHours: String(course.durationHours ?? ""),
      lectures: String(course.lectures ?? ""),
      startAt: course.startAt?.slice(0, 16) || "",
      endAt: course.endAt?.slice(0, 16) || "",
      thumbnailPath: course.thumbnailPath || "",
    });
    setIsCourseModalOpen(true);
  };

  const closeCourseModal = () => {
    setIsCourseModalOpen(false);
    setSelectedCourse(null);
    setCourseForm(initialCourseForm);
  };

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

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
    enabled: isAdmin,
  });

  const { data: weatherForecast, isLoading: weatherLoading } = useQuery<
    WeatherForecast[]
  >({
    queryKey: ["weather-forecast"],
    queryFn: async () => {
      const response = await weatherApi.getForecast();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });

  const enrollmentItems = enrollments?.data ?? [];
  const courseItems = courses?.data ?? [];
  const userItems = users?.data ?? [];
  const categoryItems = categories?.data ?? [];
  const todayWeather = weatherForecast?.[0];

  const saveCourse = useMutation({
    mutationFn: async () => {
      const payload: CourseCreateRequest = {
        title: courseForm.title.trim(),
        description: courseForm.description.trim() || undefined,
        categoryId: Number(courseForm.categoryId),
        price: courseForm.price ? Number(courseForm.price) : undefined,
        durationHours: courseForm.durationHours
          ? Number(courseForm.durationHours)
          : undefined,
        lectures: courseForm.lectures ? Number(courseForm.lectures) : undefined,
        startAt: courseForm.startAt || undefined,
        endAt: courseForm.endAt || undefined,
        thumbnailPath: courseForm.thumbnailPath.trim() || undefined,
      };

      const response = selectedCourse
        ? await courseApi.update(selectedCourse.id, payload)
        : await courseApi.create(payload);

      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success(
        response.message ||
          (selectedCourse
            ? "Course updated successfully"
            : "Course created successfully"),
      );
      closeCourseModal();
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      console.error("Save course failed:", apiError.response?.data || error);
      toast.error(apiError.response?.data?.message || "Failed to save course.");
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await courseApi.delete(courseId);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success(response.message || "Course deleted successfully");
      setCourseToDelete(null);
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      console.error("Delete course failed:", apiError.response?.data || error);
      toast.error(
        apiError.response?.data?.message || "Failed to delete course.",
      );
    },
  });

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
            className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest"
            onClick={openCreateCourseModal}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Course
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
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-xl font-black tracking-tighter uppercase">
                {isAdmin ? "Recent Enrollments" : "My Recent Enrollments"}
              </CardTitle>
              <Button
                variant="outline"
                asChild
                className="rounded-xl font-bold uppercase tracking-widest"
              >
                <Link to="/dashboard/enrollments">
                  {isAdmin ? "Review All" : "View All"}
                </Link>
              </Button>
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

          {isAdmin && (
            <Card className="rounded-xl border-2 shadow-none">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-xl font-black tracking-tighter uppercase">
                    Manage Courses
                  </CardTitle>
                  <p className="text-sm text-zinc-500">
                    Add, edit, and delete courses from one place.
                  </p>
                </div>
                <Button
                  className="h-11 rounded-xl px-5 font-bold uppercase tracking-widest"
                  onClick={openCreateCourseModal}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
              </CardHeader>
              <CardContent>
                {courseItems.length > 0 ? (
                  <div className="space-y-4">
                    {courseItems.map((course) => (
                      <div
                        key={course.id}
                        className="flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-black tracking-tight text-zinc-900">
                              {course.title}
                            </p>
                            <Badge variant="secondary" className="rounded-xl">
                              {course.categoryName ||
                                `Category #${course.categoryId}`}
                            </Badge>
                          </div>
                          <p className="line-clamp-2 text-sm max-w-96 text-zinc-500">
                            {course.description || "No description available."}
                          </p>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                            ${course.price || 0} • {course.durationHours || 0}h
                            • {course.lectures || 0} lectures
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            className="rounded-xl font-bold uppercase tracking-widest"
                            onClick={() => openEditCourseModal(course)}
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            className="rounded-xl font-bold uppercase tracking-widest"
                            onClick={() => setCourseToDelete(course)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-zinc-500">
                    No courses available yet.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl font-bold uppercase tracking-widest border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-white"
                asChild
              >
                <Link to="/dashboard/enrollments">
                  <Clock className="mr-2 h-4 w-4" />
                  {isAdmin ? "Manage Enrollments" : "My Enrollments"}
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

          <Card className="overflow-hidden rounded-xl border-2 shadow-none">
            <CardHeader className="bg-linear-to-r from-sky-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tighter">
                <CloudSun className="h-5 w-5 text-sky-600" /> Weather Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {weatherLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
              ) : todayWeather ? (
                <>
                  <div className="rounded-xl bg-zinc-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Today
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black tracking-tighter text-zinc-900">
                          {todayWeather.temperatureC}°C
                        </p>
                        <p className="text-sm text-zinc-500">
                          {todayWeather.temperatureF}°F • {todayWeather.summary}
                        </p>
                      </div>
                      <div className="rounded-full bg-sky-100 p-3 text-sky-700">
                        <Thermometer className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {weatherForecast?.slice(1, 4).map((item) => (
                      <div
                        key={item.date}
                        className="flex items-center justify-between rounded-xl border px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wide text-zinc-900">
                            {new Date(item.date).toLocaleDateString(undefined, {
                              weekday: "short",
                            })}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {item.summary}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-zinc-700">
                          {item.temperatureC}°C
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-500">
                  Weather data is not available right now.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {courseModalMode === "create" ? "Add Course" : "Edit Course"}
                </h2>
                <p className="text-sm text-zinc-500">
                  Fill in the course details and save your changes.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCourseModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form
              className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveCourse.mutate();
              }}
            >
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Course Title
                </label>
                <Input
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                  placeholder="AI-Based Software Engineering Bootcamp"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="flex w-full rounded-xl border border-zinc-300 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                  placeholder="Describe what students will learn in this course"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Category
                </label>
                <select
                  value={courseForm.categoryId}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-zinc-300 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                  required
                >
                  <option value="">Select a category</option>
                  {categoryItems.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Thumbnail Path
                </label>
                <Input
                  value={courseForm.thumbnailPath}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      thumbnailPath: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                  placeholder="/uploads/courses/course-thumbnail.png"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Price
                </label>
                <Input
                  type="number"
                  min="0"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                  placeholder="15000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Duration Hours
                </label>
                <Input
                  type="number"
                  min="0"
                  value={courseForm.durationHours}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      durationHours: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                  placeholder="40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Lectures
                </label>
                <Input
                  type="number"
                  min="0"
                  value={courseForm.lectures}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      lectures: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                  placeholder="12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Start Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={courseForm.startAt}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      startAt: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  End Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={courseForm.endAt}
                  onChange={(e) =>
                    setCourseForm((prev) => ({
                      ...prev,
                      endAt: e.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
                <Button
                  type="submit"
                  className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest"
                  disabled={
                    saveCourse.isPending ||
                    !courseForm.title.trim() ||
                    !courseForm.categoryId
                  }
                >
                  {saveCourse.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : courseModalMode === "create" ? (
                    <Plus className="mr-2 h-4 w-4" />
                  ) : (
                    <Pencil className="mr-2 h-4 w-4" />
                  )}
                  {courseModalMode === "create"
                    ? "Create Course"
                    : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest"
                  onClick={closeCourseModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
              Delete Course
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Are you sure you want to delete{" "}
              <strong>{courseToDelete.title}</strong>? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="destructive"
                className="h-11 rounded-xl px-5 font-bold uppercase tracking-widest"
                disabled={deleteCourse.isPending}
                onClick={() => deleteCourse.mutate(courseToDelete.id)}
              >
                {deleteCourse.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-xl px-5 font-bold uppercase tracking-widest"
                onClick={() => setCourseToDelete(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
