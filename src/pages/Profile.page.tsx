/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { userApi } from "@/api/user.api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ApiResponse, User } from "@/type";

interface ProfileFormState {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
}

export default function ProfilePage() {
  const { user, token, isAuthenticated, login } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProfileFormState>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    profilePicture: "",
  });

  const { data: profileResponse, isLoading } = useQuery<ApiResponse<User>>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const response = await userApi.getById(user!.id);
      console.log("User profile response:", response.data);
      return response.data;
    },
    enabled: isAuthenticated && !!user?.id,
  });

  const profile = profileResponse?.data;

  useEffect(() => {
    if (!profile) return;

    setFormData({
      name: profile.name ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
      profilePicture: profile.profilePicture ?? "",
    });
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not found");

      const payload = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        roleId: profile?.roleId ?? user.roleId,
        isActive: profile?.isActive ?? user.isActive ?? true,
        phoneNumber: formData.phoneNumber || null,
        address: formData.address || null,
        profilePicture: formData.profilePicture || null,
      };

      console.log("Profile update payload:", payload);
      const response = await userApi.update(user.id, payload);
      console.log("Profile update response:", response.data);
      return response.data;
    },
    onSuccess: (response) => {
      const updatedUser: User = {
        ...(profile ?? user!),
        ...response.data,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        profilePicture: formData.profilePicture || undefined,
      };

      login(updatedUser, token ?? localStorage.getItem("auth_token") ?? "");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success(response.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error.response?.data || error);
      toast.error(
        error.response?.status === 405
          ? "Profile update is currently not available on the server."
          : error.response?.data?.message || "Failed to update profile.",
      );
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl border-2 shadow-none">
          <CardContent className="py-12 text-center">
            <UserCircle2 className="mx-auto mb-4 h-14 w-14 text-zinc-300" />
            <h1 className="mb-2 text-3xl font-black uppercase tracking-tighter">
              Sign in to view your profile
            </h1>
            <p className="mb-6 text-zinc-500">
              Please login first to access and update your profile details.
            </p>
            <Button
              asChild
              className="rounded-xl font-bold uppercase tracking-widest"
            >
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
          Account Settings
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">
          My Profile
        </h1>
        <p className="max-w-2xl text-zinc-500">
          View your account information and keep your profile up to date.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
          <Card className="border-2 shadow-none">
            <CardContent className="flex flex-col items-center p-8 text-center">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt={formData.name || "Profile"}
                  className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-zinc-100"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-3xl font-black text-zinc-700">
                  {(formData.name || user.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {formData.name || user.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {formData.email || user.email}
              </p>
              <div className="mt-6 w-full space-y-3 text-left text-sm">
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-zinc-500" />
                  <span>
                    {profile?.roleName ||
                      `Role #${profile?.roleId ?? user.roleId}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <span className="truncate">
                    {formData.email || user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <span>{formData.phoneNumber || "Add a phone number"}</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  <span>{formData.address || "Add an address"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                Edit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfile.mutate();
                }}
              >
                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="h-11 rounded-xl"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Phone Number
                  </label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="h-11 rounded-xl"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      value={formData.profilePicture}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          profilePicture: e.target.value,
                        }))
                      }
                      className="h-11 rounded-xl pl-10"
                      placeholder="https://example.com/avatar.png"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Enter your address"
                    className="flex w-full rounded-xl border border-zinc-300 bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                  <Button
                    type="submit"
                    className="rounded-lg px-2 py-2.5 font-bold uppercase tracking-widest"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg px-2 py-1.5 font-bold uppercase tracking-widest"
                    onClick={() => {
                      if (!profile) return;
                      setFormData({
                        name: profile.name ?? "",
                        email: profile.email ?? "",
                        phoneNumber: profile.phoneNumber ?? "",
                        address: profile.address ?? "",
                        profilePicture: profile.profilePicture ?? "",
                      });
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
