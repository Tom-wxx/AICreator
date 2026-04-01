"use client";

import { useRef, useEffect, useCallback } from "react";
import { Trash2, Bot } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useAppStore } from "@/lib/store/useAppStore";
import { MessageBubble } from "./MessageBubble";
import { PromptInput } from "./PromptInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/types";

export function ChatPanel() {
  const {
    chatMessages,
    addChatMessage,
    updateLastAssistantMessage,
    clearChat,
  } = useAppStore();

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isStreamingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        const viewport = scrollRef.current.querySelector(
          '[data-slot="scroll-area-viewport"]'
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  const isStreaming = isStreamingRef.current;

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: uuid(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      addChatMessage(userMsg);

      const assistantMsg: ChatMessage = {
        id: uuid(),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };
      addChatMessage(assistantMsg);
      isStreamingRef.current = true;

      const currentMessages = useAppStore.getState().chatMessages;
      const apiMessages = currentMessages
        .filter((m) => m.role !== "system")
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const abort = new AbortController();
      abortRef.current = abort;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abort.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let accumulated = "";

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
                accumulated += parsed.content;
                updateLastAssistantMessage(accumulated);
              }
              if (parsed.error) {
                updateLastAssistantMessage(
                  accumulated + `\n\n**Error:** ${parsed.error}`
                );
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateLastAssistantMessage(
            `**请求失败:** ${(err as Error).message || "未知错误"}`
          );
        }
      } finally {
        isStreamingRef.current = false;
        abortRef.current = null;
      }
    },
    [addChatMessage, updateLastAssistantMessage]
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    isStreamingRef.current = false;
  }, []);

  const isEmpty = chatMessages.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">AI 对话</span>
        </div>
        {!isEmpty && (
          <Button variant="ghost" size="icon-xs" onClick={clearChat}>
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      <ScrollArea ref={scrollRef} className="flex-1">
        {isEmpty ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Bot className="size-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">开始对话</p>
              <p className="text-xs text-muted-foreground">
                向 AI Creator 描述你的需求，我可以帮你生成图片、视频或撰写内容
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {[
                "帮我写一篇关于人工智能的文章",
                "生成一张赛博朋克风格的城市图片",
                "写一段产品宣传文案",
              ].map((hint) => (
                <button
                  key={hint}
                  onClick={() => handleSend(hint)}
                  className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-2">
            {chatMessages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={
                  isStreaming &&
                  msg.role === "assistant" &&
                  i === chatMessages.length - 1
                }
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <PromptInput
        onSend={handleSend}
        onStop={handleStop}
        isLoading={isStreaming}
      />
    </div>
  );
}
