export type GenerationStatus = "idle" | "pending" | "generating" | "completed" | "error";

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: "dall-e-3" | "sdxl";
  size: "1024x1024" | "1024x1792" | "1792x1024";
  quality: "standard" | "hd";
  style: "vivid" | "natural";
  n: number;
}

export interface VideoGenerationParams {
  prompt: string;
  model: "minimax-video-01" | "runway-gen3";
  duration: number;
  aspectRatio: "16:9" | "9:16" | "1:1";
}

export interface ContentGenerationParams {
  prompt: string;
  type: "article" | "copy" | "script" | "freeform";
  tone: "professional" | "casual" | "creative" | "formal";
  language: "zh" | "en";
  maxTokens: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  createdAt: string;
  params: ImageGenerationParams;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  model: string;
  status: GenerationStatus;
  createdAt: string;
  params: VideoGenerationParams;
}

export interface GeneratedContent {
  id: string;
  content: string;
  prompt: string;
  type: string;
  createdAt: string;
  params: ContentGenerationParams;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: ToolCallResult[];
  createdAt: string;
}

export interface ToolCallResult {
  toolName: string;
  input: Record<string, unknown>;
  output?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface TaskRecord {
  id: string;
  type: "image" | "video" | "content";
  status: GenerationStatus;
  prompt: string;
  result?: string;
  params: string;
  createdAt: string;
  completedAt?: string;
  favorite: boolean;
}
