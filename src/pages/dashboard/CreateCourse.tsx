/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";

import { categoryApi } from "@/api/category.api";
import { courseApi } from "@/api/course.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, Category, CourseCreateRequest } from "@/type";

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

const initialFormState: CourseFormState = {
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

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState<CourseFormState>(initialFormState);

  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery<
    ApiResponse<Category[]>
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
  });

  const categoryItems = categoriesResponse?.data ?? [];

  const createCourse = useMutation({
    mutationFn: async () => {
      const payload: CourseCreateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        categoryId: Number(formData.categoryId),
        price: formData.price ? Number(formData.price) : undefined,
        durationHours: formData.durationHours
          ? Number(formData.durationHours)
          : undefined,
        lectures: formData.lectures ? Number(formData.lectures) : undefined,
        startAt: formData.startAt || undefined,
        endAt: formData.endAt || undefined,
        thumbnailPath: formData.thumbnailPath.trim() || undefined,
      };

      console.log("Create course payload:", payload);
      const response = await courseApi.create(payload);
      console.log("Create course response:", response.data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success(response.message || "Course created successfully");
      navigate(
        response.data?.id ? `/courses/${response.data.id}` : "/dashboard",
      );
    },
    onError: (error: any) => {
      console.error("Create course failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to create course");
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl border-2 shadow-none">
          <CardContent className="py-12 text-center">
            <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter">
              Admin access required
            </h1>
            <p className="mb-6 text-zinc-500">
              Only admins can create new courses from this page.
            </p>
            <Button
              asChild
              className="rounded-none font-bold uppercase tracking-widest"
            >
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
            Admin Panel
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">
            Create New Course
          </h1>
          <p className="max-w-2xl text-zinc-500">
            Add a new course using the same data shape as your API.
          </p>
        </div>

        <Button
          variant="outline"
          asChild
          className="rounded-xl font-bold uppercase tracking-widest"
        >
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="rounded-xl border-2 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                createCourse.mutate();
              }}
            >
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Course Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Describe what students will learn in this course"
                  className="flex w-full rounded-xl border border-zinc-300 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-zinc-300 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                  required
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
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
                  value={formData.thumbnailPath}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
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
                  value={formData.durationHours}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.lectures}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
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
                  value={formData.endAt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endAt: e.target.value }))
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest"
                  disabled={createCourse.isPending}
                >
                  {createCourse.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl px-6 font-bold uppercase tracking-widest"
                  onClick={() => setFormData(initialFormState)}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
