import CoursesList from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { CheckCircle, Clock, HandCoins, Tag } from "lucide-react";
import Link from "next/link";
import Testimonial from "./_components/testimonial";
import Student1 from '@/public/Student1.webp'
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import BackgroundVideo from 'next-video/background-video';
import Video from "next-video";

export default async function Home() {
  const {userId} = auth()

  if(userId){
    return redirect('/search')
  }


  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      category: true,
      chapters: true,
    },
  })
  const coursesWithProgressWithCategory = courses.map((course) => ({
    ...course,
    progress: null,
    imageUrl: course.imageUrl || "",
  }));

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <BackgroundVideo className="relative flex justify-center items-center bg-black h-[80vh] text-white" src="video_bg.mp4">
  <div className="absolute top-0 right-0 w-full h-full bg-black opacity-50" />
  <div className="relative container mx-auto px-6 text-center">
    <h1 className="text-4xl md:text-5xl leading-[65px] font-bold mb-10">
      متسعد تغير حياتك؟
    </h1>
    <p className="md:text-xl text-md mb-24">
       كن من أقوي 1% من البشر في العالم و حقق الثروة و النجاح الذي تستحقه
    </p>
    <Link
      href="/search"
      className="text-white font-semibold px-3 py-[4px] border border-white rounded-lg hover:text-emerald-700 hover:bg-white transition"
    >
      أنضم الآن
    </Link>
  </div>
  </BackgroundVideo>


      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-gray-50 dark:bg-gray-900">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-semibold">لماذا تختارنا؟</h2>
    <p className="text-lg mt-4">
      منصتنا تقدم ميزات فريدة تجعل التعلم سهلاً وممتعاً.
    </p>
  </div>
  <div className="max-md:flex-col flex gap-4 flex-wrap justify-center">
    <div className="flex-1 flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-lg">
      <CheckCircle className="h-12 w-12 text-emerald-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">مدربون خبراء</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-200">
        تعلم من خبراء الصناعة ذوي الخبرة الواقعية.
      </p>
    </div>
    <div className="flex-1 flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-lg">
      <Clock className="h-12 w-12 text-emerald-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">تعلم مرن</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-200">
        الوصول إلى الكورسات في أي وقت، في أي مكان، وفقاً لسرعتك الخاصة.
      </p>
    </div>
    <div className="flex-1 flex flex-col items-center bg-white dark:bg-black p-6 rounded-lg shadow-lg">
      <HandCoins  className="h-12 w-12 text-emerald-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">أسعار مناسبة</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-200">
        كورساتنا متاحة بأسعار في متناول الجميع، مما يتيح لك التعلم دون الحاجة إلى إنفاق الكثير.
      </p>
    </div>
  </div>
</section>


      {/* Courses Section */}
      <section className="bg-gray-100 dark:bg-black py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-semibold mb-8">أقوي الكورسات</h2>
          <CoursesList items={coursesWithProgressWithCategory} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold">ماذا يقول طلابنا</h2>
          <p className="text-lg mt-4">
            استمع إلى طلابنا حول تجربتهم التعليمية.
          </p>
        </div>
        <div className="flex md:flex-row flex-col flex-wrap justify-center gap-4">
<Testimonial 
  opinion="تجربة تعليمية رائعة مع كورسات مميزة وفريق دعم ممتاز" 
  name="أحمد محمد" 
  imageUrl="/Student1.jpg" 
/>
<Testimonial 
  opinion="أفضل منصة تعليمية استخدمتها حتى الآن، مرونة كبيرة في التعلم" 
  name="سارة علي" 
  imageUrl="/Student2.jpg" 
/>
<Testimonial 
  opinion="محتوى ممتاز ومدربون محترفون، أنصح الجميع بهذه المنصة" 
  name="خالد حسن" 
  imageUrl="/Student3.jpg" 
/>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-[#37B7C3] to-[#088395] text-white py-20">
  <div className="container mx-auto px-6 text-center">
    <h2 className="md:text-5xl text-3xl font-bold mb-6">
      هل أنت مستعد للبدء في التعلم؟
    </h2>
    <p className="text-xl mb-8">
      انضم إلينا اليوم وابدأ رحلتك التعليمية مع أفضل الكورسات التدريبية
    </p>
    <a
      href="/sign-in"
      className="bg-white text-emerald-600 border py-2 px-8 rounded-full shadow-lg hover:bg-transparent hover:border-white hover:text-white transition duration-300"
    >
      ابدأ الآن
    </a>
  </div>
</section>



    </div>
  );
}
