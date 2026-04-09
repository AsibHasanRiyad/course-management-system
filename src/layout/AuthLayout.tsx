import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans antialiased">
      <main className="flex flex-1 items-center justify-center p-4">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
