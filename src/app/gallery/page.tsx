"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { MediaCard } from "@/components/gallery/MediaCard";
import { PreviewDialog } from "@/components/gallery/PreviewDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Video, FileText, LayoutGrid, Heart, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskRecord } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";

const PAGE_SIZE = 50;

const filters = [
  { value: "all", label: "全部", icon: LayoutGrid },
  { value: "image", label: "图片", icon: Image },
  { value: "video", label: "视频", icon: Video },
  { value: "content", label: "内容", icon: FileText },
] as const;

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get("type") || "all";

  const [activeFilter, setActiveFilter] = useState(initialType);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [previewTask, setPreviewTask] = useState<TaskRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchTasks = useCallback(async (reset = false) => {
    setLoading(true);
    const currentOffset = reset ? 0 : offset;
    const params = new URLSearchParams();
    if (activeFilter !== "all") {
      params.set("type", activeFilter);
    }
    if (favoriteOnly) params.set("favorite", "true");
    if (search) params.set("search", search);
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(currentOffset));

    try {
      const res = await fetch(`/api/tasks?${params}`);
      const data = await res.json();
      const mapped: TaskRecord[] = (data.tasks || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (t: any) => ({ ...t, favorite: Boolean(t.favorite) })
      );

      if (reset) {
        setTasks(mapped);
        setOffset(PAGE_SIZE);
      } else {
        setTasks((prev) => [...prev, ...mapped]);
        setOffset((prev) => prev + PAGE_SIZE);
      }
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, favoriteOnly, search, offset]);

  useEffect(() => {
    fetchTasks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, favoriteOnly, search]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    if (value === "all") {
      router.push("/gallery");
    } else {
      router.push(`/gallery?type=${value}`);
    }
  };

  const handleToggleFavorite = async (id: string, favorite: boolean) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, favorite } : t))
      );
      if (previewTask?.id === id) {
        setPreviewTask((prev) => (prev ? { ...prev, favorite } : null));
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const hasMore = tasks.length < total;

  return (
    <>
      <Header showSearch searchValue={search} onSearchChange={setSearch}>
        <Button
          variant={favoriteOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setFavoriteOnly(!favoriteOnly)}
        >
          <Heart className={cn("size-3.5", favoriteOnly && "fill-current")} />
          收藏
        </Button>
      </Header>

      <div className="flex items-center gap-2 border-b border-border px-6 py-2">
        <SlidersHorizontal className="size-3.5 text-muted-foreground" />
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activeFilter === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <Badge variant="secondary" className="text-xs">
          {total} 个作品
        </Badge>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading && tasks.length === 0 ? (
          <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <LayoutGrid className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">暂无作品</p>
              <p className="mt-1 text-xs text-muted-foreground">
                创建你的第一个作品，它会出现在这里
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
              {tasks.map((task) => (
                <div key={task.id} className="break-inside-avoid">
                  <MediaCard
                    task={task}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onPreview={setPreviewTask}
                  />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTasks(false)}
                  disabled={loading}
                >
                  {loading ? "加载中..." : "加载更多"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <PreviewDialog
        task={previewTask}
        open={!!previewTask}
        onOpenChange={(open) => !open && setPreviewTask(null)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
      />
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense>
      <GalleryContent />
    </Suspense>
  );
}
