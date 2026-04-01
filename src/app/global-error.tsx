"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center bg-zinc-950 text-zinc-50">
        <div className="flex flex-col items-center px-4 text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertTriangle className="size-8 text-red-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">应用发生严重错误</h2>
          <p className="mb-6 max-w-md text-sm text-zinc-400">
            {error.message || "应用遇到了无法恢复的错误，请尝试刷新页面。"}
          </p>
          {error.digest && (
            <p className="mb-4 font-mono text-xs text-zinc-600">
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            <RotateCcw className="size-4" />
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
