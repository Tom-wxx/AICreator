"use client";

import { useState } from "react";
import { Image as ImageIcon, Wand2, RefreshCw } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/useAppStore";
import { ProgressBar } from "./ProgressBar";

export function ImageGenerator() {
  const { imageStatus, setImageStatus, addGeneratedImage, generatedImages } = useAppStore();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<"dall-e-3" | "sdxl">("dall-e-3");
  const [size, setSize] = useState<"1024x1024" | "1024x1792" | "1792x1024">("1024x1024");
  const [quality, setQuality] = useState<"standard" | "hd">("standard");
  const [style, setStyle] = useState<"vivid" | "natural">("vivid");
  const [negativePrompt, setNegativePrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim() || imageStatus === "generating") return;
    setImageStatus("generating");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, size, quality, style, negativePrompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      (data.urls as string[]).forEach((url: string) => addGeneratedImage(url));
      setImageStatus("completed");
    } catch (err) {
      console.error(err);
      setImageStatus("error");
    }
  };

  return (
    <div className="flex h-full gap-4 p-4">
      <div className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-5 text-blue-500" />
          <h2 className="text-base font-semibold">文生图</h2>
        </div>

        <div className="space-y-2">
          <Label>描述 (Prompt)</Label>
          <Textarea
            placeholder="描述你想生成的图片..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>模型</Label>
          <Select value={model} onValueChange={(v) => { if (v) setModel(v as typeof model); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
              <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>尺寸</Label>
          <Select value={size} onValueChange={(v) => { if (v) setSize(v as typeof size); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">1024 x 1024 (方形)</SelectItem>
              <SelectItem value="1024x1792">1024 x 1792 (竖版)</SelectItem>
              <SelectItem value="1792x1024">1792 x 1024 (横版)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {model === "dall-e-3" && (
          <>
            <div className="space-y-2">
              <Label>质量</Label>
              <div className="flex gap-2">
                {(["standard", "hd"] as const).map((q) => (
                  <Badge
                    key={q}
                    variant={quality === q ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setQuality(q)}
                  >
                    {q === "standard" ? "标准" : "高清"}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>风格</Label>
              <div className="flex gap-2">
                {(["vivid", "natural"] as const).map((s) => (
                  <Badge
                    key={s}
                    variant={style === s ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStyle(s)}
                  >
                    {s === "vivid" ? "鲜明" : "自然"}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {model === "sdxl" && (
          <div className="space-y-2">
            <Label>负面提示词</Label>
            <Textarea
              placeholder="不希望出现的内容..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>
        )}

        <ProgressBar status={imageStatus} />

        <Button
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={!prompt.trim() || imageStatus === "generating"}
        >
          {imageStatus === "generating" ? (
            <RefreshCw className="size-4 animate-spin" />
          ) : (
            <Wand2 className="size-4" />
          )}
          {imageStatus === "generating" ? "生成中..." : "生成图片"}
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <h3 className="text-sm font-medium text-muted-foreground">生成结果</h3>
        {generatedImages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-muted">
            <div className="text-center">
              <ImageIcon className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">结果将在这里显示</p>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 auto-rows-max grid-cols-2 gap-3 overflow-y-auto">
            {generatedImages.map((url, i) => (
              <Card key={i} className="group relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Generated ${i}`} className="w-full object-cover" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
