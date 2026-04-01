import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { generateVideo } from "@/lib/providers/replicate";

export const videoGenTool = new DynamicStructuredTool({
  name: "generate_video",
  description: "Generate a video from a text description using AI video models",
  schema: z.object({
    prompt: z.string().describe("Detailed text description of the video to generate"),
  }),
  func: async ({ prompt }) => {
    try {
      const url = await generateVideo({ prompt });
      return JSON.stringify({ success: true, url });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Video generation failed",
      });
    }
  },
});
