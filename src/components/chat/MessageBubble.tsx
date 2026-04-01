"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isStreaming,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-pre:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-code:rounded prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-pre:rounded-lg prose-pre:bg-background/50">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {isStreaming && (
              <span className="ml-0.5 inline-block size-2 animate-pulse rounded-full bg-primary" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
