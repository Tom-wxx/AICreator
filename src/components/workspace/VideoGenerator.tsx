"use client";

import { useState, useCallback, useRef } from "react";
import { Video, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store/useAppStore";
import { ProgressBar } from "./ProgressBar";

export function VideoGenerator() {
  const { videoStatus, setVideoStatus, generatedVideoUrl, setGeneratedVideoUrl } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("minimax/video-01");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollForResult = useCallback(
    (predictionId: string, taskId: string) => {
      setVideoStatus("generating");
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/generate-video?predictionId=${predictionId}&taskId=${taskId}`
          );
          const data = await res.json();

          if (data.status === "completed" && data.videoUrl) {
            if (pollRef.current) clearInterval(pollRef.current);
            setGeneratedVideoUrl(data.videoUrl);
            setVideoStatus("completed");
          } else if (data.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            setVideoStatus("error");
          }
        } catch {
          if (pollRef.current) clearInterval(pollRef.current);
          setVideoStatus("error");
        }
      }, 5000);
    },
    [setVideoStatus, setGeneratedVideoUrl]
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || videoStatus === "generating" || videoStatus === "pending") return;
    setVideoStatus("pending");
    setGeneratedVideoUrl(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      pollForResult(data.predictionId, data.id);
    } catch (err) {
      console.error(err);
      setVideoStatus("error");
    }
  };

  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Video className="size-5 text-purple-500" />
          <h2 className="text-base font-semibold">文生视频</h2>
        </div>

        <div className="space-y-2">
          <Label>描述 (Prompt)</Label>
          <Textarea
            placeholder="描述你想生成的视频场景..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>模型</Label>
          <Select value={model} onValueChange={(v) => { if (v) setModel(v); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimax/video-01">Minimax Video-01</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ProgressBar status={videoStatus} />

        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={!prompt.trim() || videoStatus === "generating" || videoStatus === "pending"}
        >
          {videoStatus === "generating" || videoStatus === "pending" ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Wand2 className="size-4" />
          )}
          {videoStatus === "generating"
            ? "生成中..."
            : videoStatus === "pending"
              ? "排队中..."
              : "生成视频"}
        </Button>

        <p className="text-xs text-muted-foreground">
          视频生成通常需要 2-5 分钟，请耐心等待
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <h3 className="text-sm font-medium text-muted-foreground">生成结果</h3>
        {!generatedVideoUrl ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-muted">
            <div className="text-center">
              <Video className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">视频将在这里显示</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-black">
            <video
              src={generatedVideoUrl}
              controls
              className="max-h-full max-w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
