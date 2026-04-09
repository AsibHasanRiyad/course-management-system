import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../../api/course.api";
import { categoryApi } from "../../api/category.api";

import CourseCard from "../../components/shared/CourseCard";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { Loader2, Search, X } from "lucide-react";
import type { Category, Course } from "@/type";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return response.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
  });

  const filteredCourses = courses?.filter((course) => {
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
      <div className="mb-12 space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase">
          All Courses
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Browse our extensive catalog of courses and find the perfect one to
          advance your career.
        </p>
      </div>

      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-none border-zinc-300 focus-visible:ring-zinc-800 h-12"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="rounded-none font-bold uppercase tracking-wider text-xs h-10"
          >
            All
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-none font-bold uppercase tracking-wider text-xs h-10"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {coursesLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
