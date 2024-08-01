import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest, // Use NextRequest instead of Request
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the course belongs to the authenticated user
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update chapter to unpublished
    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
      },
      data: {
        isPublished: false,
      },
    });

    // Check if there are any published chapters left in the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If no published chapters are left, update the course to unpublished
    if (publishedChaptersInCourse.length === 0) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublishedChapter, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
