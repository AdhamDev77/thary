"use client";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";
import Logo from "@/app/(dashboard)/_components/logo";
import { ModeToggle } from "./mode-toggle";

type Props = {};

const NavbarRoutes: React.FC<Props> = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="w-auto md:w-full flex justify-between align-center">
        {!userId && (
          <>
            <div>
              <Logo />
            </div>
            <div className="hidden md:flex gap-x-10 items-center mr-20">
            <Link className=" font-semibold  text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white" href="/">
              الرئيسية
            </Link>
            <Link className=" font-semibold  text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white" href="/search">
              كورسات
            </Link>
            <Link className=" font-semibold  text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white" href="/instructors">
              مدربين
            </Link>
            <Link className=" font-semibold  text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white" href="/aboutus">
              من نحن
            </Link>

            </div>
          </>
        )}
        <div className="md:flex hidden items-center gap-x-2 mr-auto">
          {userId ? (
            <>
              {isTeacherPage || isCoursePage ? (
                <Link href="/">
                  <Button>
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </Button>
                </Link>
              ) : (
                <Link href="/teacher/courses">
                  <Button size="sm" variant="ghost">
                    نظام المعلم
                  </Button>
                </Link>
              )}
            </>
          ) : null}
          <Button variant='outline' size='sm'>
          <Link className="text-slate-600 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white" href="/contact">
              تواصل معنا
            </Link>
          </Button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button className="flex gap-x-2" size="sm">
                تسجيل <LogIn className="w-4 h-4 rotate-180" />
              </Button>
            </SignInButton>
          </SignedOut>
              <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
