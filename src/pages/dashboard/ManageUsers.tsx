import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
} from "lucide-react";

import { userApi } from "@/api/user.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, User } from "@/type";

type UserDraft = {
  roleId: number;
  isActive: boolean;
};

const DEFAULT_ROLE_OPTIONS = [
  { id: 1, name: "Admin" },
  { id: 2, name: "User" },
  { id: 3, name: "Student" },
];

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<number, UserDraft>>({});
  const [activeUpdateId, setActiveUpdateId] = useState<number | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);

  const { data: usersResponse, isLoading } = useQuery<ApiResponse<User[]>>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await userApi.getAll();
      console.log("Users list response:", response.data);
      return response.data;
    },
    enabled: isAuthenticated && isAdmin,
  });

  const userItems = usersResponse?.data ?? [];

  useEffect(() => {
    if (!userItems.length) return;

    setDrafts(
      Object.fromEntries(
        userItems.map((item) => [
          item.id,
          { roleId: item.roleId, isActive: item.isActive },
        ]),
      ),
    );
  }, [userItems]);

  const roleOptions = useMemo(() => {
    const dynamicOptions = userItems.map((item) => ({
      id: item.roleId,
      name: item.roleName || `Role ${item.roleId}`,
    }));

    return Array.from(
      new Map(
        [...DEFAULT_ROLE_OPTIONS, ...dynamicOptions].map((role) => [
          role.id,
          role,
        ]),
      ).values(),
    );
  }, [userItems]);

  const filteredUsers = userItems.filter((item) => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return true;

    return (
      item.name.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search) ||
      item.roleName?.toLowerCase().includes(search)
    );
  });

  const updateUser = useMutation({
    mutationFn: async (targetUser: User) => {
      const draft = drafts[targetUser.id] ?? {
        roleId: targetUser.roleId,
        isActive: targetUser.isActive,
      };

      const payload = {
        name: targetUser.name,
        email: targetUser.email,
        roleId: draft.roleId,
        isActive: draft.isActive,
      };

      console.log("Update user payload:", { id: targetUser.id, ...payload });
      const response = await userApi.update(targetUser.id, payload);
      console.log("Update user response:", response.data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(response.message || "User updated successfully");
    },
    onError: (error: any) => {
      console.error("Update user failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update user. Please try again.",
      );
    },
    onSettled: () => {
      setActiveUpdateId(null);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (targetUser: User) => {
      console.log("Deleting user:", targetUser.id);
      const response = await userApi.delete(targetUser.id);
      console.log("Delete user response:", response.data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(response.message || "User deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete user failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete user. Please try again.",
      );
    },
    onSettled: () => {
      setActiveDeleteId(null);
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
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
            <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter">
              Admin access required
            </h1>
            <p className="mb-6 text-zinc-500">
              Only admins can manage users from this page.
            </p>
            <Button
              asChild
              className="rounded-xl font-bold uppercase tracking-widest"
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
            Manage Users
          </h1>
          <p className="max-w-2xl text-zinc-500">
            Promote users to admin, change account status, or remove accounts.
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Total Users
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {userItems.length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Admins
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {userItems.filter((item) => item.roleId === 1).length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Active Users
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {userItems.filter((item) => item.isActive).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 rounded-xl border-2 shadow-none">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="py-12 text-center text-zinc-500">
            No users found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((targetUser) => {
            const draft = drafts[targetUser.id] ?? {
              roleId: targetUser.roleId,
              isActive: targetUser.isActive,
            };
            const isCurrentUser = targetUser.id === user?.id;

            return (
              <Card
                key={targetUser.id}
                className="rounded-xl border-2 shadow-none"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black uppercase tracking-tight">
                          {targetUser.name}
                        </h3>
                        {isCurrentUser && (
                          <Badge className="rounded-xl uppercase tracking-widest">
                            Current Account
                          </Badge>
                        )}
                        <Badge
                          variant={draft.isActive ? "default" : "secondary"}
                          className="rounded-xl uppercase tracking-widest"
                        >
                          {draft.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <p className="text-sm text-zinc-500">
                        {targetUser.email}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Current role:{" "}
                        {targetUser.roleName || `Role #${targetUser.roleId}`}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_160px_auto_auto]">
                      <select
                        value={draft.roleId}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [targetUser.id]: {
                              ...draft,
                              roleId: Number(e.target.value),
                            },
                          }))
                        }
                        className="flex h-11 w-full rounded-xl border border-zinc-300 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        type="button"
                        variant={draft.isActive ? "default" : "outline"}
                        className="h-11 rounded-xl font-bold uppercase tracking-widest"
                        onClick={() =>
                          setDrafts((prev) => ({
                            ...prev,
                            [targetUser.id]: {
                              ...draft,
                              isActive: !draft.isActive,
                            },
                          }))
                        }
                      >
                        {draft.isActive ? "Active" : "Inactive"}
                      </Button>

                      <Button
                        type="button"
                        className="h-11 rounded-xl font-bold uppercase tracking-widest"
                        disabled={updateUser.isPending || deleteUser.isPending}
                        onClick={() => {
                          setActiveUpdateId(targetUser.id);
                          updateUser.mutate(targetUser);
                        }}
                      >
                        {updateUser.isPending &&
                        activeUpdateId === targetUser.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UserCog className="mr-2 h-4 w-4" />
                        )}
                        Save
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        className="h-11 rounded-xl font-bold uppercase tracking-widest"
                        disabled={
                          isCurrentUser ||
                          updateUser.isPending ||
                          deleteUser.isPending
                        }
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Delete ${targetUser.name}? This action cannot be undone.`,
                          );

                          if (!confirmed) return;

                          setActiveDeleteId(targetUser.id);
                          deleteUser.mutate(targetUser);
                        }}
                      >
                        {deleteUser.isPending &&
                        activeDeleteId === targetUser.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
