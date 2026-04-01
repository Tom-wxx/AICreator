"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store/useAppStore";

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const { theme, toggleTheme } = useAppStore();
  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "浅色模式" : "深色模式";

  const button = (
    <Button
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      onClick={toggleTheme}
      className={collapsed ? "" : "w-full justify-start gap-2"}
    >
      <Icon className="size-4" />
      {!collapsed && <span className="text-sm">{label}</span>}
    </Button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
