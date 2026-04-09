import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../../api/course.api";
import { categoryApi } from "../../api/category.api";

import CourseCard from "../../components/shared/CourseCard";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { Loader2, Search, X } from "lucide-react";
import type { ApiResponse, Category, Course } from "@/type";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: courses, isLoading: coursesLoading } = useQuery<
    ApiResponse<Course[]>
  >({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return response.data;
    },
  });

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
  });

  const courseItems = courses?.data ?? [];
  const categoryItems = categories?.data ?? [];

  const filteredCourses = courseItems.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? course.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="grid gap-6 border-b border-zinc-200 px-5 py-6 lg:grid-cols-[1.3fr_420px] lg:items-end lg:px-8">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Course Catalog
            </span>
            <h1 className="text-4xl font-black tracking-tighter uppercase md:text-5xl">
              Find the right course faster
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 md:text-base">
              Search by keyword, browse by category, and quickly discover the
              courses that match your goals.
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {filteredCourses.length} course
              {filteredCourses.length === 1 ? "" : "s"} available
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Search Courses
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search by course title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl border-zinc-300 bg-zinc-50 pl-10 pr-4 focus-visible:ring-zinc-800"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-5 lg:px-8">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              Filter by category
            </p>
            {(searchQuery || selectedCategory !== null) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="h-8 w-fit px-0 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 hover:bg-transparent hover:text-zinc-900"
              >
                Reset Filters
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl bg-zinc-50 p-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="h-10 rounded-xl font-bold uppercase tracking-wider text-xs"
            >
              All Categories
            </Button>
            {categoryItems.map((category) => {
              const isSelected = selectedCategory === category.id;

              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    isSelected
                      ? "h-10 rounded-xl border-black bg-black font-bold uppercase tracking-wider text-xs text-white hover:bg-zinc-800"
                      : "h-10 rounded-xl border-zinc-200 bg-white font-bold uppercase tracking-wider text-xs text-zinc-800 hover:border-zinc-900 hover:bg-zinc-100"
                  }
                >
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {coursesLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-zinc-50 p-6">
            <X className="h-10 w-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-2">
            No courses found
          </h3>
          <p className="text-zinc-500 mb-6">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className="rounded-none font-bold uppercase tracking-widest"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
