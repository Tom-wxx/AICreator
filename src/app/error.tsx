"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="size-8 text-destructive" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">出了点问题</h2>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {error.message || "页面加载时遇到了错误，请尝试刷新或返回首页。"}
      </p>
      {error.digest && (
        <p className="mb-4 font-mono text-xs text-muted-foreground/50">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button onClick={reset} variant="default" className="gap-2">
          <RotateCcw className="size-4" />
          重试
        </Button>
        <Button variant="outline" className="gap-2" render={<Link href="/" />}>
          <Home className="size-4" />
          返回首页
        </Button>
      </div>
    </div>
  );
}
