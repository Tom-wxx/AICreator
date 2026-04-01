"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { SendHorizonal, Loader2, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function PromptInput({
  onSend,
  onStop,
  isLoading = false,
  placeholder = "输入消息，按 Enter 发送...",
  className,
}: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("border-t border-border bg-card p-4", className)}>
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-10 max-h-40 resize-none pr-2 text-sm"
          rows={1}
          disabled={isLoading}
        />
        {isLoading ? (
          <Button
            variant="destructive"
            size="icon"
            className="shrink-0"
            onClick={onStop}
          >
            <StopCircle className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="shrink-0"
            onClick={handleSend}
            disabled={!value.trim()}
          >
            <SendHorizonal className="size-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Enter 发送 · Shift+Enter 换行
      </p>
    </div>
  );
}
