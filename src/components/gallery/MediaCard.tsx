"use client";

import { useState } from "react";
import {
  Heart,
  Download,
  Trash2,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { TaskRecord } from "@/types";

const typeConfig = {
  image: { icon: ImageIcon, label: "图片", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  video: { icon: Video, label: "视频", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  content: { icon: FileText, label: "内容", color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
} as const;

interface MediaCardProps {
  task: TaskRecord;
  onToggleFavorite: (id: string, favorite: boolean) => void;
  onDelete: (id: string) => void;
  onPreview: (task: TaskRecord) => void;
}

export function MediaCard({ task, onToggleFavorite, onDelete, onPreview }: MediaCardProps) {
  const [imgError, setImgError] = useState(false);
  const config = typeConfig[task.type];
  const Icon = config.icon;
  const isImage = task.type === "image";
  const isVideo = task.type === "video";
  const hasVisualResult = (isImage || isVideo) && task.result && !imgError;

  const handleDownload = () => {
    if (!task.result) return;
    if (task.type === "content") {
      const blob = new Blob([task.result], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `content-${task.id.slice(0, 8)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const a = document.createElement("a");
      a.href = task.result;
      a.download = `${task.type}-${task.id.slice(0, 8)}`;
      a.target = "_blank";
      a.click();
    }
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(task.prompt);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/5 transition-all hover:ring-foreground/15 hover:shadow-lg">
      {hasVisualResult ? (
        <button type="button" className="relative w-full cursor-pointer overflow-hidden bg-muted" onClick={() => onPreview(task)}>
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={task.result!} alt={task.prompt} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" onError={() => setImgError(true)} />
          ) : (
            <div className="relative aspect-video w-full">
              <video src={task.result!} className="size-full object-cover" muted preload="metadata" onError={() => setImgError(true)} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/90">
                  <Video className="size-5 text-zinc-900" />
                </div>
              </div>
            </div>
          )}
        </button>
      ) : (
        <button type="button" className="flex w-full cursor-pointer flex-col gap-2 p-4" onClick={() => onPreview(task)}>
          <div className={cn("flex size-9 items-center justify-center rounded-lg", config.bgColor)}>
            <Icon className={cn("size-4", config.color)} />
          </div>
          {task.type === "content" && task.result && (
            <p className="line-clamp-4 text-left text-sm leading-relaxed text-muted-foreground">{task.result}</p>
          )}
          {!task.result && <p className="text-left text-sm text-muted-foreground/60">暂无结果</p>}
        </button>
      )}

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-foreground/80">{task.prompt}</p>
          <Badge variant="secondary" className={cn("shrink-0 text-[10px]", config.color)}>{config.label}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <time className="text-[10px] text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </time>

          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(task.id, !task.favorite);
              }}
            >
              <Heart className={cn("size-3", task.favorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-xs" onClick={(e) => e.stopPropagation()} />
                }
              >
                <MoreHorizontal className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top">
                <DropdownMenuItem onClick={() => onPreview(task)}>
                  <ExternalLink className="size-3.5" /> 预览
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyPrompt}>
                  <Copy className="size-3.5" /> 复制 Prompt
                </DropdownMenuItem>
                {task.result && (
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="size-3.5" /> 下载
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => onDelete(task.id)}>
                  <Trash2 className="size-3.5" /> 删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {task.favorite && (
        <div className="absolute right-2 top-2 z-10">
          <Heart className="size-4 fill-red-500 text-red-500 drop-shadow-md" />
        </div>
      )}
    </div>
  );
}
