import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Initialize Mux client with tokenId and tokenSecret from environment variables
const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID as string,
  tokenSecret: process.env.MUX_TOKEN_SECRET as string,
});

interface PatchRequest {
  isPublished?: boolean;
  videoUrl?: string;
  [key: string]: any;
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user is the owner of the course
    const courseOwner = await db.course.findFirst({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the chapter exists
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Handle video URL deletion
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        try {
          await muxClient.video.assets.delete(existingMuxData.assetId);
        } catch (error) {
          console.error("Error deleting Mux asset:", error);
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    // Delete the chapter
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // Check if there are any published chapters remaining in the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error("Error handling DELETE request:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("User ID:", userId);
    console.log("Params:", params);

    const { isPublished, ...values }: PatchRequest = await req.json();
    console.log("Request Body:", values);

    // Update the chapter
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        isPublished: isPublished ?? undefined, // Only update if provided
      },
    });

    console.log("Updated Chapter:", chapter);

    // Handle video URL changes
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        try {
          await muxClient.video.assets.delete(existingMuxData.assetId);
        } catch (error) {
          console.error("Error deleting Mux asset:", error);
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      try {
        const asset = await muxClient.video.assets.create({
          input: [{ url: values.videoUrl }],
          playback_policy: ["public"],
        });

        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
          },
        });
      } catch (error) {
        console.error("Error creating Mux asset:", error);
        return new NextResponse("Error creating Mux asset", { status: 500 });
      }
    }

    return NextResponse.json(chapter, { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_ID_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
