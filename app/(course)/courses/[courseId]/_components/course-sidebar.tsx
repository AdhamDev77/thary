import React from "react";
import CourseSidebarItem from "./course-sidebar-item";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CourseProgress from "@/components/course-progress";

type CourseWithDetails = Course & {
  chapters: (Chapter & {
    userProgress: UserProgress[] | null;
  })[];
};

type CourseSidebarProps = {
  course: CourseWithDetails | undefined;
  progressCount: number | null;
};

const CourseSidebar: React.FC<CourseSidebarProps> = async  ({
  course,
  progressCount,
}) => {
  if (!course) {
    return <div>معلومات الكورس غير متاحة</div>;
  }
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-l flex flex-col overflow-y-auto shadow-sm bg-white dark:bg-gray-900">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-bold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount!} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
