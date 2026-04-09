import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.name?.trim() || "User";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tighter text-primary">
                ICT Bangladesh
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/courses"
                className="transition-colors hover:text-primary/80"
              >
                Courses
              </Link>
              <Link
                to="/categories"
                className="transition-colors hover:text-primary/80"
              >
                Categories
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-10 items-center gap-2 rounded-full px-2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {userInitial}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium leading-none">{displayName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      variant="destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 animate-in fade-in-0 bg-black/50 backdrop-blur-sm duration-200"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm animate-in slide-in-from-right-full duration-300 ease-out border-l bg-background p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-black tracking-tighter text-primary">
                EDUSTREAM
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <Link
                to="/courses"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100"
              >
                Courses
              </Link>
              <Link
                to="/categories"
                onClick={closeMobileMenu}
                className="block rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100"
              >
                Categories
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100"
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="mt-6 border-t pt-6">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-xs text-zinc-500">{user?.email}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="h-11 w-full rounded-xl font-bold uppercase tracking-widest"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl font-bold uppercase tracking-widest"
                    asChild
                  >
                    <Link to="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    className="h-11 w-full rounded-xl font-bold uppercase tracking-widest"
                    asChild
                  >
                    <Link to="/register" onClick={closeMobileMenu}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
