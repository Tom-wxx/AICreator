import { create } from "zustand";
import type {
  ChatMessage,
  GenerationStatus,
  TaskRecord,
} from "@/types";

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  activeTab: "chat" | "image" | "video" | "content";
  setActiveTab: (tab: AppState["activeTab"]) => void;

  theme: "light" | "dark";
  toggleTheme: () => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  clearChat: () => void;

  imageStatus: GenerationStatus;
  setImageStatus: (s: GenerationStatus) => void;
  generatedImages: string[];
  addGeneratedImage: (url: string) => void;

  videoStatus: GenerationStatus;
  setVideoStatus: (s: GenerationStatus) => void;
  generatedVideoUrl: string | null;
  setGeneratedVideoUrl: (url: string | null) => void;

  contentStatus: GenerationStatus;
  setContentStatus: (s: GenerationStatus) => void;
  generatedContent: string;
  setGeneratedContent: (c: string) => void;
  appendGeneratedContent: (c: string) => void;

  taskHistory: TaskRecord[];
  setTaskHistory: (tasks: TaskRecord[]) => void;
  addTask: (task: TaskRecord) => void;
  updateTask: (id: string, updates: Partial<TaskRecord>) => void;
  removeTask: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  activeTab: "chat",
  setActiveTab: (tab) => set({ activeTab: tab }),

  theme: "dark",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  updateLastAssistantMessage: (content) =>
    set((s) => {
      const msgs = [...s.chatMessages];
      const lastIdx = msgs.findLastIndex((m) => m.role === "assistant");
      if (lastIdx >= 0) {
        msgs[lastIdx] = { ...msgs[lastIdx], content };
      }
      return { chatMessages: msgs };
    }),
  clearChat: () => set({ chatMessages: [] }),

  imageStatus: "idle",
  setImageStatus: (imageStatus) => set({ imageStatus }),
  generatedImages: [],
  addGeneratedImage: (url) =>
    set((s) => ({ generatedImages: [url, ...s.generatedImages] })),

  videoStatus: "idle",
  setVideoStatus: (videoStatus) => set({ videoStatus }),
  generatedVideoUrl: null,
  setGeneratedVideoUrl: (generatedVideoUrl) => set({ generatedVideoUrl }),

  contentStatus: "idle",
  setContentStatus: (contentStatus) => set({ contentStatus }),
  generatedContent: "",
  setGeneratedContent: (generatedContent) => set({ generatedContent }),
  appendGeneratedContent: (c) =>
    set((s) => ({ generatedContent: s.generatedContent + c })),

  taskHistory: [],
  setTaskHistory: (taskHistory) => set({ taskHistory }),
  addTask: (task) =>
    set((s) => ({ taskHistory: [task, ...s.taskHistory] })),
  updateTask: (id, updates) =>
    set((s) => ({
      taskHistory: s.taskHistory.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTask: (id) =>
    set((s) => ({
      taskHistory: s.taskHistory.filter((t) => t.id !== id),
    })),
}));
