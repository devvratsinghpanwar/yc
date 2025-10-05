// components/StartupEditForm.tsx
"use client";

import { useState, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

import { z } from "zod";

// Simplified validation schema for edit mode
const editFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(3).max(20),
  pitch: z.string().min(10),
});
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateStartup, FormState } from "@/lib/actions";
import { Startup } from "@/sanity/types";
import StartupImageUploader from "@/components/StartupImageUploader";
import { getStartupImageUrl } from "@/lib/image-utils";

interface StartupEditFormProps {
  post: Startup;
}

const StartupEditForm = ({ post }: StartupEditFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(post.pitch || "");
  const [imageMode, setImageMode] = useState<"url" | "upload">(
    post.imageAsset ? "upload" : "url"
  );
  const [imageUrl, setImageUrl] = useState(() => {
    // If we have a URL, use it; if we have an asset but no URL, use the asset URL
    if (post.image) return post.image;
    if (post.imageAsset && !post.image) return getStartupImageUrl(post) || "";
    return "";
  });
  const [uploadData, setUploadData] = useState<{
    assetId: string;
    imageUrl: string;
  } | null>(post.imageAsset ? {
    assetId: post.imageAsset.asset?._ref || "",
    imageUrl: getStartupImageUrl(post) || ""
  } : null);

  // When switching to URL mode from upload mode, populate with the current image URL
  const handleModeSwitch = (mode: "url" | "upload") => {
    if (mode === "url" && imageMode === "upload" && uploadData && !imageUrl) {
      // If switching from upload to URL and no URL is set, use the upload image URL
      setImageUrl(uploadData.imageUrl || "");
    }
    setImageMode(mode);
  };

  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (prevState: FormState, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string || "",
        imageAssetId: formData.get("imageAssetId") as string || "",
        uploadedImageUrl: formData.get("uploadedImageUrl") as string || "",
        pitch,
      };



      // Use simplified validation for edit mode
      await editFormSchema.parseAsync({
        title: formValues.title,
        description: formValues.description,
        category: formValues.category,
        pitch: formValues.pitch,
      });

      // Add image data to formData
      if (imageMode === "url" && imageUrl && imageUrl.trim() !== "") {
        formData.set("link", imageUrl.trim());
        formData.delete("imageAssetId");
        formData.delete("uploadedImageUrl");
      } else if (imageMode === "upload" && uploadData && uploadData.assetId) {
        formData.set("imageAssetId", uploadData.assetId);
        formData.set("uploadedImageUrl", uploadData.imageUrl || "");
        formData.set("link", ""); // Set empty link for upload mode
      } else {
        // If no image is provided, set empty values
        formData.set("link", "");
        formData.set("imageAssetId", "");
        formData.set("uploadedImageUrl", "");
      }

      formData.set("pitch", pitch);
      formData.set("id", post._id);

      const result = await updateStartup(prevState, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup has been updated successfully!",
        });

        router.push(`/startup/${post._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Validation Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return {
          ...prevState,
          message: "Validation failed",
          status: "ERROR" as const,
        };
      }

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        message: error instanceof Error ? error.message : "An unexpected error has occurred",
        status: "ERROR" as const,
      };
    }
  };

  const [, formAction, isPending] = useActionState(handleFormSubmit, {
    message: "",
    status: "INITIAL" as const,
  });

  const handleImageUploadSuccess = (assetId: string, imageUrl: string) => {
    setUploadData({ assetId, imageUrl });
  };

  const handleImageRemove = () => {
    setUploadData(null);
  };

  return (
    <section className="section_container">
      <form action={formAction} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Startup Title"
            defaultValue={post.title || ""}
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Startup Description"
            defaultValue={post.description || ""}
          />
          {errors.description && (
            <p className="startup-form_error">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="Startup Category (Tech, Health, Education...)"
            defaultValue={post.category || ""}
          />
          {errors.category && (
            <p className="startup-form_error">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="link" className="startup-form_label">
            Image
          </label>
          
          {/* Image Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={imageMode === "url" ? "default" : "outline"}
              onClick={() => handleModeSwitch("url")}
              className="text-sm"
            >
              URL
            </Button>
            <Button
              type="button"
              variant={imageMode === "upload" ? "default" : "outline"}
              onClick={() => handleModeSwitch("upload")}
              className="text-sm"
            >
              Upload
            </Button>
          </div>

          {imageMode === "url" ? (
            <Input
              id="link"
              name="link"
              className="startup-form_input"
              placeholder="Startup Image URL"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value || "")}
            />
          ) : (
            <StartupImageUploader
              onUploadSuccess={handleImageUploadSuccess}
              onRemove={handleImageRemove}
              currentImageUrl={uploadData?.imageUrl}
            />
          )}
          
          {errors.link && <p className="startup-form_error">{errors.link}</p>}
        </div>

        <div data-color-mode="light">
          <label htmlFor="pitch" className="startup-form_label">
            Pitch
          </label>
          <MDEditor
            value={pitch}
            onChange={(value) => setPitch(value as string)}
            id="pitch"
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves",
              style: {
                fontSize: 16,
                lineHeight: 1.4,
                fontFamily: "inherit",
              },
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Your Pitch"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </section>
  );
};

export default StartupEditForm;
