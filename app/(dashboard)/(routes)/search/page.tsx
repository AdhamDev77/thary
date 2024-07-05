import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import getCourses from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";

type SearchParams = {
  title: string;
  categoryId: string;
};

type Props = {
  searchParams: SearchParams;
};

const Search = async ({ searchParams }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
    return null; // Ensure the function exits early
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default Search;
