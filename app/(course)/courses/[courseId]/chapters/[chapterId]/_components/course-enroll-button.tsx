"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

type Props = {
  courseId: string;
  price: number;
};

const CourseEnrollButton = ({
  courseId,
  price,
}: Props) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <Button size='sm' className=" w-full md:w-auto">
    أفتح الكورس ب {price} جنية فقط
    </Button>
  );
};

export default CourseEnrollButton;
