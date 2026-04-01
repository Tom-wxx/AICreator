"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  Loader2,
  StopCircle,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ContentGenerationParams } from "@/types";

const CONTENT_TYPES = [
  { value: "article", label: "文章" },
  { value: "copy", label: "文案" },
  { value: "script", label: "脚本" },
  { value: "freeform", label: "自由创作" },
] as const;

const TONES = [
  { value: "professional", label: "专业" },
  { value: "casual", label: "轻松" },
  { value: "creative", label: "创意" },
  { value: "formal", label: "正式" },
] as const;

const LANGUAGES = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
] as const;

export function ContentWriter() {
  const {
    contentStatus,
    setContentStatus,
    generatedContent,
    setGeneratedContent,
    appendGeneratedContent,
  } = useAppStore();

  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentGenerationParams["type"]>("article");
  const [tone, setTone] = useState<ContentGenerationParams["tone"]>("professional");
  const [language, setLanguage] = useState<ContentGenerationParams["language"]>("zh");
  const [maxTokens, setMaxTokens] = useState(2048);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const isGenerating = contentStatus === "generating";

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setContentStatus("generating");
    setGeneratedContent("");

    const abort = new AbortController();
    abortRef.current = abort;

    const systemPrompt = `You are a professional content writer. Generate ${contentType} content with a ${tone} tone. Write in ${language === "zh" ? "Chinese" : "English"}.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt.trim() },
          ],
        }),
        signal: abort.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;

          try {
            const parsed = JSON.parse(payload);
            if (parsed.content) {
              appendGeneratedContent(parsed.content);
            }
          } catch {
            /* skip malformed lines */
          }
        }
      }

      setContentStatus("completed");

      const finalContent = useAppStore.getState().generatedContent;
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "content",
          prompt: prompt.trim(),
          result: finalContent,
          params: { type: contentType, tone, language, maxTokens },
          status: "completed",
        }),
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setContentStatus("error");
      }
    } finally {
      abortRef.current = null;
    }
  }, [prompt, isGenerating, contentType, tone, language, maxTokens, setContentStatus, setGeneratedContent, appendGeneratedContent]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setContentStatus("completed");
  }, [setContentStatus]);

  const handleCopy = useCallback(async () => {
    if (!generatedContent) return;
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedContent]);

  const handleDownload = useCallback(() => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedContent]);

  const handleReset = useCallback(() => {
    setGeneratedContent("");
    setContentStatus("idle");
  }, [setGeneratedContent, setContentStatus]);

  const handleSliderChange = useCallback((value: number | readonly number[]) => {
    const num = typeof value === "number" ? value : value[0];
    setMaxTokens(num);
  }, []);

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex w-full flex-col border-b border-border lg:w-80 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2">
          <FileText className="size-4 text-emerald-500" />
          <span className="text-sm font-medium">内容生成</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            <div className="space-y-1.5">
              <Label className="text-xs">创作要求</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要创作的内容..."
                className="min-h-24 text-sm"
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">内容类型</Label>
              <Select
                value={contentType}
                onValueChange={(v) => { if (v) setContentType(v as ContentGenerationParams["type"]); }}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">语气风格</Label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-colors",
                      tone === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">语言</Label>
              <div className="flex gap-1.5">
                {LANGUAGES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLanguage(value)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-colors",
                      language === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">最大长度</Label>
                <span className="text-xs text-muted-foreground">{maxTokens} tokens</span>
              </div>
              <Slider
                value={[maxTokens]}
                onValueChange={handleSliderChange}
                min={256}
                max={8192}
                step={256}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          {isGenerating ? (
            <Button variant="destructive" className="w-full gap-2" onClick={handleStop}>
              <StopCircle className="size-4" /> 停止生成
            </Button>
          ) : (
            <Button className="w-full gap-2" onClick={handleGenerate} disabled={!prompt.trim()}>
              <Sparkles className="size-4" /> 开始生成
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">预览</span>
            {contentStatus === "generating" && (
              <Badge variant="secondary" className="gap-1">
                <Loader2 className="size-3 animate-spin" /> 生成中
              </Badge>
            )}
            {contentStatus === "completed" && generatedContent && (
              <Badge variant="outline" className="text-emerald-500">已完成</Badge>
            )}
          </div>
          {generatedContent && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-7" onClick={handleCopy} title="复制">
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="size-7" onClick={handleDownload} title="下载">
                <Download className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" onClick={handleReset} title="清除">
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1">
          {!generatedContent && !isGenerating ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                <FileText className="size-6 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">AI 内容生成</p>
                <p className="text-xs text-muted-foreground">在左侧填写创作要求，调整参数后点击生成</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{generatedContent}</ReactMarkdown>
                {isGenerating && (
                  <span className="ml-0.5 inline-block size-2 animate-pulse rounded-full bg-emerald-500" />
                )}
              </article>
            </div>
          )}
        </ScrollArea>

        {generatedContent && (
          <div className="border-t border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              {generatedContent.length} 字符 · {generatedContent.split(/\n/).length} 行
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
