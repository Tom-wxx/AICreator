"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Image,
  Video,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskRecord } from "@/types";

const statusConfig = {
  idle: { icon: Clock, label: "待处理", color: "text-muted-foreground" },
  pending: { icon: Loader2, label: "排队中", color: "text-yellow-500" },
  generating: { icon: Loader2, label: "生成中", color: "text-blue-500" },
  completed: { icon: CheckCircle2, label: "已完成", color: "text-emerald-500" },
  error: { icon: XCircle, label: "失败", color: "text-destructive" },
} as const;

const typeConfig = {
  image: { icon: Image, label: "图片", color: "text-blue-500" },
  video: { icon: Video, label: "视频", color: "text-purple-500" },
  content: { icon: FileText, label: "内容", color: "text-emerald-500" },
} as const;

export default function HistoryPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/tasks?${params}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <Header showSearch searchValue={search} onSearchChange={setSearch} />
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-muted-foreground">暂无历史记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => {
              const status = statusConfig[task.status];
              const type = typeConfig[task.type];
              const StatusIcon = status.icon;
              const TypeIcon = type.icon;

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className={cn("flex size-9 items-center justify-center rounded-lg bg-muted")}>
                    <TypeIcon className={cn("size-4", type.color)} />
                  </div>

                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <p className="truncate text-sm font-medium">{task.prompt}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {type.label}
                      </Badge>
                      <span className="flex items-center gap-1 text-[10px]">
                        <StatusIcon
                          className={cn(
                            "size-3",
                            status.color,
                            (task.status === "pending" || task.status === "generating") && "animate-spin"
                          )}
                        />
                        <span className={status.color}>{status.label}</span>
                      </span>
                      <time className="text-[10px] text-muted-foreground">
                        {new Date(task.createdAt).toLocaleString("zh-CN")}
                      </time>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {task.result && task.type !== "content" && (
                      <a
                        href={task.result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </>
  );
}
