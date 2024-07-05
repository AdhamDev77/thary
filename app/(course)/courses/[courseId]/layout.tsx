import getProgress from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          include: {
            userProgress: {
              where: {
                userId,
              },
            },
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

    const progressCount = await getProgress(userId, course.id);

    return (
      <div className="h-full">
        <div className="h-[80px] md:pr-80 fixed inset-y-0 w-full z-50">
            <CourseNavbar course={course} progressCount={progressCount} />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar course={course} progressCount={progressCount} />
        </div>
        <main className="md:pr-80 h-full pt-[80px]">{children}</main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching course:", error);
    return redirect("/sign-in");
  }
};

export default CourseLayout;
