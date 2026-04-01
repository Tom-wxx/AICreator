"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Images,
  History,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

const navItems = [
  { href: "/", label: "工作台", icon: MessageSquare },
  { href: "/gallery", label: "作品画廊", icon: Images },
  { href: "/history", label: "历史记录", icon: History },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
}) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={content} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar({
  open,
  collapsed,
  onToggleCollapse,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          "lg:relative lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-sidebar-border px-4",
            collapsed ? "justify-center px-2" : "justify-between"
          )}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary">
                <Sparkles className="size-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-sidebar-foreground">
                AI Creator
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="hidden text-sidebar-foreground/60 hover:text-sidebar-foreground lg:flex"
          >
            {collapsed ? (
              <PanelLeft className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
          {collapsed && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    href="/"
                    className="flex size-7 items-center justify-center rounded-lg bg-sidebar-primary"
                  />
                }
              >
                <Sparkles className="size-4 text-sidebar-primary-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right">AI Creator</TooltipContent>
            </Tooltip>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <NavItem
                  key={item.href}
                  {...item}
                  active={isActive}
                  collapsed={collapsed}
                />
              );
            })}
          </div>

          {!collapsed && (
            <>
              <Separator className="my-3" />
              <p className="mb-2 px-3 text-xs font-medium text-sidebar-foreground/40 uppercase">
                快速筛选
              </p>
              {[
                { href: "/gallery?type=image", label: "图片" },
                { href: "/gallery?type=video", label: "视频" },
                { href: "/gallery?type=content", label: "内容" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <ThemeToggle collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
