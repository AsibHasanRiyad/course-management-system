import { Link } from "react-router-dom";
import { Bookmark, BookOpen } from "lucide-react";
import type { Course } from "@/type";

interface CourseCardProps {
  course: Course;
}

const FALLBACK =
  "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group rounded-2xl bg-white border border-zinc-100 shadow-sm overflow-hidden flex flex-col w-full max-w-sm transition-all duration-200 hover:shadow-md hover:border-zinc-300">
      {/* Thumbnail — no top padding, flush to card edge */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-100">
        <img
          src={course.thumbnailPath || FALLBACK}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = FALLBACK;
          }}
        />
        {/* Bookmark button overlaid on image */}
        <button
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow hover:bg-white hover:text-zinc-900 transition-colors backdrop-blur-sm"
          aria-label="Bookmark course"
        >
          <Bookmark className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Category badge */}
        <span className="self-start rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500 tracking-wide">
          {course.categoryName || "General"}
        </span>

        {/* Title with left accent bar */}
        <div className="flex gap-2.5">
          <div className="w-0.75 shrink-0 self-stretch rounded-full bg-zinc-900" />
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold leading-snug text-zinc-900 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {course.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-100" />

        {/* Meta + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-extrabold text-zinc-900">
              ${course.price || 0}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <BookOpen className="h-3 w-3" />
              {course.lectures || 0} lectures · {course.durationHours || 0}h
            </span>
          </div>

          <Link
            to={`/courses/${course.id}`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white tracking-wide transition-all hover:bg-zinc-700 active:scale-95"
          >
            Get Course →
          </Link>
        </div>
      </div>
    </div>
  );
}
