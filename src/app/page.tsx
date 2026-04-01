"use client";

import { MessageSquare, Image, Video, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store/useAppStore";
import { Header } from "@/components/layout/Header";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ImageGenerator } from "@/components/workspace/ImageGenerator";
import { VideoGenerator } from "@/components/workspace/VideoGenerator";
import { ContentWriter } from "@/components/workspace/ContentWriter";

const tabs = [
  { value: "chat", label: "AI 对话", icon: MessageSquare },
  { value: "image", label: "文生图", icon: Image },
  { value: "video", label: "文生视频", icon: Video },
  { value: "content", label: "内容生成", icon: FileText },
] as const;

export default function Home() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <>
      <Header />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="border-b border-border bg-card px-4">
            <TabsList className="h-10 bg-transparent p-0">
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Icon className="size-3.5" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden">
            <ChatPanel />
          </TabsContent>
          <TabsContent value="image" className="mt-0 flex-1 overflow-hidden">
            <ImageGenerator />
          </TabsContent>
          <TabsContent value="video" className="mt-0 flex-1 overflow-hidden">
            <VideoGenerator />
          </TabsContent>
          <TabsContent value="content" className="mt-0 flex-1 overflow-hidden">
            <ContentWriter />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
