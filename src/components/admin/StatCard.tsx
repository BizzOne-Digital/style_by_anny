import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E8E0F0] bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-[#2D2D2D]">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && (
            <p className="mt-2 text-xs font-medium text-[#4A2C6E]">{trend}</p>
          )}
        </div>
        <div className="rounded-lg bg-[#E8E0F0] p-3">
          <Icon className="h-6 w-6 text-[#4A2C6E]" />
        </div>
      </div>
    </div>
  );
}
