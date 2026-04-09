import { Link } from "react-router-dom";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { Clock, BookOpen, ArrowRight } from "lucide-react";
import type { Course } from "@/type";
import { Badge } from "../ui/badge";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden border-zinc-200 transition-all hover:border-zinc-800 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-zinc-100">
          {course.thumbnailPath ? (
            <img
              src={course.thumbnailPath}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <BookOpen className="h-12 w-12" />
            </div>
          )}
          <Badge className="absolute left-4 top-4 bg-white/90 text-black hover:bg-white">
            {course.categoryName || "General"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="mb-2 text-xl font-bold tracking-tight line-clamp-2">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available for this course."}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.durationHours || 0}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{course.lectures || 0} lectures</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-6">
        <span className="text-lg font-bold">${course.price || 0}</span>
        <Link
          to={`/courses/${course.id}`}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
