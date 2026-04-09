import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseApi } from "../api/course.api";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Loader2,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import type { Course } from "@/type";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await courseApi.getById(Number(id));
      return response.data;
    },
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to enroll in this course");
      return;
    }
    // Enrollment logic would go here
    toast.success("Enrollment request sent!");
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
          Course not found
        </h2>
        <Button
          asChild
          variant="outline"
          className="rounded-none font-bold uppercase tracking-widest"
        >
          <Link to="/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-zinc-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <Link
            to="/courses"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge className="bg-white text-black hover:bg-zinc-200 rounded-none uppercase tracking-widest">
                {course.categoryName || "General"}
              </Badge>
              <h1 className="text-4xl font-black tracking-tighter uppercase md:text-6xl">
                {course.title}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
                {course.description ||
                  "Master the skills needed for the modern professional landscape with this comprehensive course."}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-zinc-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.durationHours || 0} Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lectures || 0} Lectures</span>
                </div>
                {course.startAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Starts {new Date(course.startAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden border-4 border-white/10 bg-zinc-800 shadow-2xl">
              {course.thumbnailPath ? (
                <img
                  src={course.thumbnailPath}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                  <BookOpen className="h-20 w-20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">
                  Course Overview
                </h2>
                <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed">
                  <p>
                    {course.description ||
                      "Detailed course description will be available soon."}
                  </p>
                  <p className="mt-4">
                    This course is designed to provide you with a deep
                    understanding of the subject matter. Through a combination
                    of lectures, practical exercises, and real-world case
                    studies, you will gain the skills and knowledge needed to
                    excel in your field.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">
                  What you'll learn
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    "Foundational principles and concepts",
                    "Advanced techniques and best practices",
                    "Real-world application and case studies",
                    "Industry-standard tools and workflows",
                    "Problem-solving strategies",
                    "Professional networking and growth",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-zinc-900 shrink-0 mt-0.5" />
                      <span className="text-zinc-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-4 border-zinc-900 p-8 bg-white sticky top-24">
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter">
                    ${course.price || 0}
                  </span>
                  <span className="text-zinc-400 line-through text-lg font-bold">
                    ${(course.price || 0) * 1.5}
                  </span>
                </div>
                <div className="space-y-4">
                  <Button
                    onClick={handleEnroll}
                    className="w-full h-14 rounded-none font-black uppercase tracking-widest text-lg"
                  >
                    Enroll Now
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="rounded-none font-bold uppercase tracking-widest border-2"
                    >
                      <Heart className="mr-2 h-4 w-4" /> Wishlist
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-none font-bold uppercase tracking-widest border-2"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>
                <div className="mt-8 space-y-4 border-t pt-8">
                  <h4 className="font-black uppercase tracking-widest text-xs text-zinc-400">
                    This course includes:
                  </h4>
                  <ul className="space-y-3 text-sm font-bold uppercase tracking-tight">
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4" /> Full lifetime access
                    </li>
                    <li className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4" /> Access on mobile and TV
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4" /> Certificate of
                      completion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
