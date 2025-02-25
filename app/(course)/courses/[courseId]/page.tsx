import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const ChapterIdPage = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/sign-in");
  }
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default ChapterIdPage;
