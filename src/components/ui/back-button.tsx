"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() => history.back()}
    >
      <ArrowLeft className="size-4" />
      返回上页
    </Button>
  );
}
