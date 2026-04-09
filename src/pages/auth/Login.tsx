/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { authApi } from "../../api/auth.api";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, type User } from "@/type";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await authApi.login(values);
      console.log("Login API response:", response.data);

      const authData = response.data.data;
      const normalizedUser: User = {
        id: authData.userId,
        name: authData.name,
        email: authData.email,
        roleId:
          authData.role?.toLowerCase() === "admin"
            ? UserRole.Admin
            : authData.role?.toLowerCase() === "instructor"
              ? UserRole.Instructor
              : UserRole.User,
        isActive: true,
      };

      login(normalizedUser, authData.token);
      toast.success(response.data.message || "Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Failed to login. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md border-zinc-200 shadow-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-black tracking-tighter uppercase">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="rounded-lg border-zinc-300 focus-visible:ring-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="rounded-lg border-zinc-300 focus-visible:ring-zinc-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-lg font-bold uppercase tracking-widest"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-bold underline underline-offset-4 hover:text-primary"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
