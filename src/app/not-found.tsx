import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="size-8 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-semibold">页面未找到</h2>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        您访问的页面不存在或已被移动，请检查地址是否正确。
      </p>
      <div className="flex items-center gap-3">
        <Button variant="default" className="gap-2" render={<Link href="/" />}>
          <Home className="size-4" />
          返回首页
        </Button>
        <BackButton />
      </div>
    </div>
  );
}
