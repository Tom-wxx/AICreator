"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag,
  Mountain,
  User,
  Palette,
  Paintbrush,
  UtensilsCrossed,
  Home,
  Play,
  TreePine,
  Sparkles,
  Type,
  FileText,
  MessageCircle,
  Mail,
  Package,
  Film,
  Search,
  Languages,
  Image,
  Video,
  PenTool,
  LayoutGrid,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  promptTemplates,
  templateCategories,
  type PromptTemplate,
  type TemplateCategory,
} from "@/lib/prompt-templates";
import { toast } from "sonner";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShoppingBag,
  Mountain,
  User,
  Palette,
  Paintbrush,
  UtensilsCrossed,
  Home,
  Play,
  TreePine,
  Sparkles,
  Type,
  FileText,
  MessageCircle,
  Mail,
  Package,
  Film,
  Search,
  Languages,
  Image,
  Video,
  PenTool,
  LayoutGrid,
};

const categoryColorMap: Record<string, string> = {
  image:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  video:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  content:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

const categoryIconColor: Record<string, string> = {
  image: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  video: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  content: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const categoryTabIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  all: LayoutGrid,
  image: Image,
  video: Video,
  content: PenTool,
};

function TemplateCard({ template }: { template: PromptTemplate }) {
  const [copied, setCopied] = useState(false);
  const Icon = iconMap[template.icon] ?? Sparkles;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.prompt);
    setCopied(true);
    toast.success("Prompt 已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/15 hover:shadow-md dark:hover:border-foreground/10">
      <div className="mb-3 flex items-start justify-between">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg",
            categoryIconColor[template.category]
          )}
        >
          <Icon className="size-4" />
        </div>
        <Badge
          variant="secondary"
          className={cn("text-[10px]", categoryColorMap[template.category])}
        >
          {template.category === "image"
            ? "图片"
            : template.category === "video"
              ? "视频"
              : "文案"}
        </Badge>
      </div>
      <h3 className="mb-1 text-sm font-semibold">{template.title}</h3>
      <p className="mb-3 flex-1 text-xs text-muted-foreground">
        {template.description}
      </p>
      <div className="mb-3 flex flex-wrap gap-1">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
          {copied ? "已复制" : "复制 Prompt"}
        </Button>
      </div>
    </div>
  );
}

export function PromptTemplateLibrary() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return promptTemplates.filter((t) => {
      const matchCategory =
        activeCategory === "all" || t.category === activeCategory;
      if (!searchQuery) return matchCategory;
      const q = searchQuery.toLowerCase();
      return (
        matchCategory &&
        (t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    });
  }, [activeCategory, searchQuery]);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Prompt 模板库</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {templateCategories.map((cat) => {
          const TabIcon = categoryTabIcon[cat.id] ?? LayoutGrid;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <TabIcon className="size-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-3 size-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">
            没有找到匹配的模板
          </p>
          <p className="text-xs text-muted-foreground/60">
            尝试调整搜索条件或分类筛选
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </section>
  );
}
