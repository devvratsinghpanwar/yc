import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  link: z
    .string()
    .optional()
    .refine(async (url) => {
      if (!url || url.trim() === "") return true; // Allow empty for uploaded images
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }, "Please provide a valid image URL"),
  imageAssetId: z.string().optional(),
  uploadedImageUrl: z.string().optional(),
  pitch: z.string().min(10),
}).refine((data) => {
  // At least one image source must be provided
  const hasUrl = data.link && data.link.trim() !== "";
  const hasUpload = data.imageAssetId && data.uploadedImageUrl;
  return hasUrl || hasUpload;
}, {
  message: "Please provide either an image URL or upload an image",
  path: ["image"], // This will show the error under the image field
});