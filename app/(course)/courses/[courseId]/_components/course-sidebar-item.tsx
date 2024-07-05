"use client";
import React from "react";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  id: string;
  courseId: string;
  isCompleted: boolean;
  isLocked: boolean;
};

const CourseSidebarItem: React.FC<Props> = ({
  id,
  courseId,
  label,
  isCompleted,
  isLocked,
}) => {
  const pathname = usePathname();
  const router = useRouter();



  const Icon = isLocked ? (Lock) : (isCompleted ? (CheckCircle) : (PlayCircle));

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 dark:text-gray-400 text-sm font-[500] pr-6 transition-all hover:text-slate-600 dark:hover:text-gray-100 hover:bg-slate-300/20 dark:hover:bg-sky-200/10",
        isActive &&
          " text-sky-700 dark:text-white bg-sky-200/20 dark:bg-sky-200/10 hover:bg-sky-200/10 hover:text-sky-700 dark:hover:text-white",
        isCompleted && " text-emerald-700 darktext-emerald-500 hover:text-emerald-700 dark:hover:bg-emerald-500",
        isCompleted && isActive && " bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-sky-500",
            isActive && "text-sky-700",
            isCompleted && "text-emerald-700"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "mr-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;
