import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest, // Use NextRequest instead of Request
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify if the course belongs to the authenticated user
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the JSON data from the request body
    const { list }: { list: { id: string; position: number }[] } = await req.json();

    // Update each chapter's position
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return NextResponse.json("تم اعادة ترتيب الأجزاء", { status: 200 });
  } catch (error) {
    console.error("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
