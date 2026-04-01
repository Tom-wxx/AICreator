"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  status: "idle" | "pending" | "generating" | "completed" | "error";
  className?: string;
}

const statusLabels: Record<string, string> = {
  idle: "",
  pending: "排队中...",
  generating: "生成中...",
  completed: "生成完成",
  error: "生成失败",
};

export function ProgressBar({ status, className }: ProgressBarProps) {
  if (status === "idle") return null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{statusLabels[status]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            status === "pending" && "w-1/4 animate-pulse bg-yellow-500",
            status === "generating" && "w-3/4 animate-pulse bg-blue-500",
            status === "completed" && "w-full bg-emerald-500",
            status === "error" && "w-full bg-destructive"
          )}
        />
      </div>
    </div>
  );
}
