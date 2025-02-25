import { GetDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "../(root)/_components/info-card";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const { completedCourses, coursesInProgress } = await GetDashboardCourses(
    userId
  );
  return (
    <div className=" p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard icon={Clock} label="جاري المتابعة" numberOfItems={coursesInProgress.length}/>
          <InfoCard variant='success' icon={CheckCircle} label="تم اِكمال" numberOfItems={completedCourses.length}/>
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
