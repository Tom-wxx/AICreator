"use client";

import { usePathname } from "next/navigation";
import { LayoutGrid, History, MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const pageTitles: Record<string, { title: string; icon: React.ElementType }> = {
  "/": { title: "创作工作台", icon: MessageSquare },
  "/gallery": { title: "作品画廊", icon: LayoutGrid },
  "/history": { title: "历史记录", icon: History },
};

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  children?: React.ReactNode;
}

export function Header({
  searchValue,
  onSearchChange,
  showSearch = false,
  children,
}: HeaderProps) {
  const pathname = usePathname();
  const page = pageTitles[pathname] || pageTitles["/"];
  const Icon = page.icon;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-muted-foreground" />
        <h1 className="text-base font-semibold">{page.title}</h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        {showSearch && (
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索作品..."
              className="h-8 pl-8 text-sm"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        )}
        {children}
      </div>
    </header>
  );
}
