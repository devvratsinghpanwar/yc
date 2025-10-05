"use client";

import React, { useState, useActionState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "../lib/actions"; // Your updated server action

// Import your UI components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send, Link, Upload } from "lucide-react";
import StartupImageUploader from "./StartupImageUploader";

const StartupForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  // The initial state for our form action
  const initialState = {
    status: "INITIAL" as const,
    message: "",
  };

  // 1. Pass the server action DIRECTLY to useActionState
  const [state, formAction] = useActionState(createPitch, initialState);

  // MDEditor requires its own state
  const [pitch, setPitch] = useState("");

  // Image upload state
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImageAssetId, setUploadedImageAssetId] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // 2. Use useEffect to react to state changes from the server action
  useEffect(() => {
    if (state.status === "SUCCESS") {
      toast({
        title: "Success!",
        description: state.message,
      });
      // Redirect on success using the ID from the state
      router.push(`/startup/${state.id}`);
    } else if (state.status === "ERROR") {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, router, toast]);

  return (
    // The form now directly calls the action managed by the hook
    <form action={formAction} className="startup-form">
      {/* --- Title Input --- */}
      <div>
        <label htmlFor="title" className="startup-form_label">Title</label>
        <Input id="title" name="title" className="startup-form_input" required placeholder="Startup Title" />
        {state.fieldErrors?.title && <p className="startup-form_error">{state.fieldErrors.title}</p>}
      </div>

      {/* --- Description Textarea --- */}
      <div>
        <label htmlFor="description" className="startup-form_label">Description</label>
        <Textarea id="description" name="description" className="startup-form_textarea" required placeholder="Startup Description" />
        {state.fieldErrors?.description && <p className="startup-form_error">{state.fieldErrors.description}</p>}
      </div>
      
      {/* --- Category Input --- */}
       <div>
        <label htmlFor="category" className="startup-form_label">Category</label>
        <Input id="category" name="category" className="startup-form_input" required placeholder="e.g., Tech, Health, Education" />
        {state.fieldErrors?.category && <p className="startup-form_error">{state.fieldErrors.category}</p>}
      </div>

      {/* --- Image Section --- */}
      <div>
        <label className="startup-form_label">Startup Image</label>

        {/* Image Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={imageMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setImageMode("url")}
            className="flex items-center gap-2"
          >
            <Link size={16} />
            URL
          </Button>
          <Button
            type="button"
            variant={imageMode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setImageMode("upload")}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </Button>
        </div>

        {/* URL Input Mode */}
        {imageMode === "url" && (
          <div>
            <Input
              id="link"
              name="link"
              className="startup-form_input"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required={imageMode === "url" && !uploadedImageUrl}
            />
            {state.fieldErrors?.link && <p className="startup-form_error">{state.fieldErrors.link}</p>}
          </div>
        )}

        {/* Upload Mode */}
        {imageMode === "upload" && (
          <div>
            <StartupImageUploader
              onUploadSuccess={(assetId, url) => {
                setUploadedImageAssetId(assetId);
                setUploadedImageUrl(url);
              }}
              onRemove={() => {
                setUploadedImageAssetId("");
                setUploadedImageUrl("");
              }}
              currentImageUrl={uploadedImageUrl}
            />
            {/* Hidden inputs to pass uploaded image data */}
            <input type="hidden" name="imageAssetId" value={uploadedImageAssetId} />
            <input type="hidden" name="uploadedImageUrl" value={uploadedImageUrl} />
          </div>
        )}

        {state.fieldErrors?.image && <p className="startup-form_error">{state.fieldErrors.image}</p>}
      </div>

      {/* --- MDEditor for Pitch --- */}
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">Pitch</label>
        {/* We need a hidden input to pass the MDEditor value to FormData */}
        <input type="hidden" name="pitch" value={pitch} />
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value || "")}
          height={300}
          // ... other props
        />
        {state.fieldErrors?.pitch && <p className="startup-form_error">{state.fieldErrors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white">
        Submit Pitch <Send className="size-5 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;