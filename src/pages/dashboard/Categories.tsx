import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../../api/category.api";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Loader2, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ApiResponse, Category } from "@/type";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase">
          Categories
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Explore our diverse range of learning paths and find the one that fits
          your goals.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories?.data?.map((category) => (
            <Card
              key={category.id}
              className="group rounded-xl border-2 border-zinc-200 transition-all hover:border-zinc-900"
            >
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 transition-colors group-hover:bg-zinc-100">
                  <BookOpen className="h-6 w-6 text-zinc-900" />
                </div>
                <h3 className="mb-2 text-2xl font-black tracking-tighter uppercase">
                  {category.name}
                </h3>
                <p className="mb-6 text-zinc-500 line-clamp-2">
                  {category.description ||
                    `Explore all courses related to ${category.name} and enhance your skills.`}
                </p>
                <Button
                  variant="ghost"
                  className="p-0 font-bold uppercase tracking-widest hover:bg-transparent hover:underline"
                  asChild
                >
                  <Link to={`/courses?category=${category.id}`}>
                    View Courses <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
