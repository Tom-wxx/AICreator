import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { chatCompletion } from "@/lib/providers/openai";

export const contentGenTool = new DynamicStructuredTool({
  name: "generate_content",
  description:
    "Generate written content (articles, copy, scripts) from a text prompt",
  schema: z.object({
    prompt: z.string().describe("The writing request or topic"),
    type: z
      .enum(["article", "copy", "script", "freeform"])
      .default("freeform")
      .describe("Content type"),
    tone: z
      .enum(["professional", "casual", "creative", "formal"])
      .default("professional")
      .describe("Writing tone"),
  }),
  func: async ({ prompt, type, tone }) => {
    try {
      const systemPrompt = `You are a professional content writer. Generate ${type} content with a ${tone} tone. Write in Chinese unless specified otherwise.`;
      const content = await chatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        maxTokens: 4096,
      });
      return JSON.stringify({ success: true, content });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Content generation failed",
      });
    }
  },
});
