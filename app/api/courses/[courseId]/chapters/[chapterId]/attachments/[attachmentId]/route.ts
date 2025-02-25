import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment, { status: 200 });
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
