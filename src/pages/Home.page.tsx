import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import CourseCard from "../components/shared/CourseCard";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  Loader2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
} from "lucide-react";
import type { ApiResponse, Category, Course } from "@/type";

export default function HomePage() {
  const { data: courses, isLoading: coursesLoading } = useQuery<
    ApiResponse<Course[]>
  >({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get<ApiResponse<Course[]>>(
        "https://register.cseconference.org/api/Courses",
      );
      return response.data;
    },
  });

  const { data: categories } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<ApiResponse<Category[]>>(
        "https://register.cseconference.org/api/Categories",
      );
      return response.data;
    },
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600 mb-6">
              <Sparkles className="h-3 w-3" />
              <span>New era of learning</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase md:text-7xl lg:text-8xl mb-6 leading-[0.9]">
              Master your <span className="text-zinc-400">future</span> with
              expert skills
            </h1>
            <p className="text-xl text-zinc-600 mb-10 max-w-xl leading-relaxed">
              Access world-class education from anywhere. Start your journey
              today with our expert-led courses designed for the modern
              professional.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-xl h-14 px-8 font-bold uppercase tracking-widest"
                asChild
              >
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl h-14 px-8 font-bold uppercase tracking-widest border-2"
                asChild
              >
                <Link to="/register">Join for Free</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 z-0 h-full w-1/3 bg-zinc-50 hidden lg:block" />
      </section>

      {/* Features Section */}
      <section className="border-y bg-zinc-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white p-3 shadow-sm border border-zinc-100">
                <Zap className="h-6 w-6 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-tight mb-1">
                  Fast Learning
                </h3>
                <p className="text-sm text-zinc-500">
                  Accelerated courses designed to get you job-ready in weeks,
                  not years.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white p-3 shadow-sm border border-zinc-100">
                <Shield className="h-6 w-6 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-tight mb-1">
                  Verified Certificates
                </h3>
                <p className="text-sm text-zinc-500">
                  Earn industry-recognized credentials that boost your
                  professional profile.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-white p-3 shadow-sm border border-zinc-100">
                <BookOpen className="h-6 w-6 text-zinc-900" />
              </div>
              <div>
                <h3 className="font-bold uppercase tracking-tight mb-1">
                  Expert Instructors
                </h3>
                <p className="text-sm text-zinc-500">
                  Learn from top industry professionals with years of real-world
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">
                Top Categories
              </h2>
              <p className="text-zinc-500">
                Explore our wide range of topics and find your passion.
              </p>
            </div>
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-widest hidden md:flex"
              asChild
            >
              <Link to="/categories">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {categories?.data?.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/courses?category=${category.id}`}
                className="group rounded-xl flex flex-col items-center justify-center border border-zinc-200 bg-white p-8 text-center transition-all hover:border-zinc-900 hover:shadow-md"
              >
                <div className="mb-4 rounded-full bg-zinc-50 p-4 transition-colors group-hover:bg-zinc-100">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold uppercase tracking-tight">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-zinc-50 py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">
                Featured Courses
              </h2>
              <p className="text-zinc-500">
                Hand-picked courses to help you start your journey.
              </p>
            </div>
            <Button
              variant="ghost"
              className="font-bold uppercase tracking-widest hidden md:flex"
              asChild
            >
              <Link to="/courses">
                Browse All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {coursesLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses?.data?.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center md:hidden">
            <Button
              size="lg"
              className="rounded-xl w-full font-bold uppercase tracking-widest"
              asChild
            >
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-900 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl mb-6">
            Ready to start learning?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of students already learning on EduStream. Get
            unlimited access to all courses with our premium plan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-black  rounded-xl h-14 px-10 font-bold uppercase tracking-widest"
              asChild
            >
              <Link to="/register">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
