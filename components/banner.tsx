"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 dark:bg-yellow-700 border-yellow-30 text-primary",
        success: "bg-emerald-700 emerald-yellow-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
}

export const Banner: React.FC<BannerProps> = ({
  label,
  variant,
}: BannerProps) => {
    const Icon = iconMap[variant || "warning"]
  return (
    <div className={cn(bannerVariants({ variant }))}>
        <Icon className="h-4 w-4 ml-2" />
        {label}
    </div>
  );
};
