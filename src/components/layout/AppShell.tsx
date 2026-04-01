"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "@/lib/store/useAppStore";

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleMobile = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeMobile = useCallback(() => setSidebarOpen(false), []);
  const toggleCollapse = useCallback(
    () => setSidebarCollapsed((v) => !v),
    []
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          open={sidebarOpen}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
          onClose={closeMobile}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </TooltipProvider>
  );
}
