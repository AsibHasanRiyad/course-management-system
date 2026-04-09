/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoryApi } from "../../api/category.api";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Loader2, BookOpen, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, Category } from "@/type";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { data: categories, isLoading } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoryApi.getAll();
      return response.data;
    },
  });

  const updateCategory = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await categoryApi.update(categoryId, {
        name: editName,
        description: editDescription,
      });
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message || "Category updated successfully");
      setEditingId(null);
      setEditName("");
      setEditDescription("");
    },
    onError: (error: any) => {
      console.error("Update category failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to update category.",
      );
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await categoryApi.delete(categoryId);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(response.message || "Category deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete category failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Failed to delete category.",
      );
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
          {categories?.data?.map((category) => {
            const isEditing = editingId === category.id;

            return (
              <Card
                key={category.id}
                className="group rounded-xl border-2 border-zinc-200 transition-all hover:border-zinc-900"
              >
                <CardContent className="p-8">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 transition-colors group-hover:bg-zinc-100">
                      <BookOpen className="h-6 w-6 text-zinc-900" />
                    </div>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            setEditingId(category.id);
                            setEditName(category.name);
                            setEditDescription(category.description || "");
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            const confirmed = window.confirm(
                              `Delete ${category.name}? This action cannot be undone.`,
                            );
                            if (!confirmed) return;
                            deleteCategory.mutate(category.id);
                          }}
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Category name"
                        className="rounded-xl"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        placeholder="Category description"
                        className="flex w-full rounded-xl border border-zinc-300 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Button
                          className="rounded-xl font-bold uppercase tracking-widest"
                          onClick={() => updateCategory.mutate(category.id)}
                          disabled={
                            updateCategory.isPending || !editName.trim()
                          }
                        >
                          {updateCategory.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Pencil className="mr-2 h-4 w-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl font-bold uppercase tracking-widest"
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                            setEditDescription("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
