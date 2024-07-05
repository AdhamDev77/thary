import { Category, Course } from "@prisma/client";
import React from "react";
import CourseCard from "./course-card";

type CoursesWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  imageUrl: string;
};

type Props = {
  items: CoursesWithProgressWithCategory[];
};

const CoursesList: React.FC<Props> = ({ items }) => {
  return (
    <>
      {items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              <CourseCard
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl}
                chaptersLength={item.chapters.length}
                price={item.price!}
                progress={item.progress}
                category={item?.category?.name!}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground mt-10">
          لا يوجد كورسات تتابعها
        </div>
      )}
    </>
  );
};

export default CoursesList;
