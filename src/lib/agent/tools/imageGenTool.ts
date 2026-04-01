import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { generateImageWithDallE } from "@/lib/providers/openai";
import { generateImageWithSDXL } from "@/lib/providers/replicate";

export const imageGenTool = new DynamicStructuredTool({
  name: "generate_image",
  description: "Generate an image from a text description using DALL-E 3 or Stable Diffusion XL",
  schema: z.object({
    prompt: z.string().describe("Detailed text description of the image to generate"),
    model: z.enum(["dall-e-3", "sdxl"]).default("dall-e-3").describe("Model to use"),
    size: z
      .enum(["1024x1024", "1024x1792", "1792x1024"])
      .default("1024x1024")
      .describe("Image size"),
  }),
  func: async ({ prompt, model, size }) => {
    try {
      let urls: string[];
      if (model === "sdxl") {
        const [w, h] = size.split("x").map(Number);
        urls = await generateImageWithSDXL({ prompt, width: w, height: h });
      } else {
        urls = await generateImageWithDallE({
          prompt,
          size,
          quality: "standard",
          style: "vivid",
          n: 1,
        });
      }
      return JSON.stringify({ success: true, urls });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Image generation failed",
      });
    }
  },
});
