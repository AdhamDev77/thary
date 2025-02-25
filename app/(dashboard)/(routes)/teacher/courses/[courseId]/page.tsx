import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { IconBadge } from "@/components/icon-badge";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import CourseActions from "./_components/course-actions";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  if (!ObjectId.isValid(params.courseId)) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, userId },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/sign-in");
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
    {!course.isPublished && (
      <Banner label="هذا الكورس غير منشور. لن يكون ظاهر للعامة"/>
    ) }
    {course.isPublished && (
      <Banner label="هذا الكورس منشور و ظاهر للجميع الآن" variant='success'/>
    ) }
      <div className="p-6 bg-white dark:bg-black">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-3">
            <h1 className="text-2xl font-bold">إعداد الكورس</h1>
            <span className="text-sm text-slate-700">
              أكمل جميع الحقول {completionText}
            </span>
          </div>
          <CourseActions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-semibold">تخصيص الكورس الخاص بك</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categoryOptions}
            />
          </div>
          <div className=" space-y-6">
            <div>
              <div className=" flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className=" text-xl">أجزاء الكورس</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div className=" flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className=" text-xl">بيع الكورس</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
            <div>
              <div className=" flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className=" text-xl">موارد و مرفقات</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
