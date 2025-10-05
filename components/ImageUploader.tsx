// components/ImageUploader.tsx
"use client";

import { useState, useRef } from 'react';
import { sanityClient } from '@/lib/sanity-client';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUploadSuccess: (assetId: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to Sanity
    setIsLoading(true);
    try {
      const asset = await sanityClient.assets.upload('image', file);
      onUploadSuccess(asset._id); // Pass the new asset ID to the parent
    } catch (error) {
      console.error('Image upload failed:', error);
      // Optionally, show an error toast to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <button
        type="button"
        onClick={handleClick}
        className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:border-pink-300 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : preview ? (
          <Image src={preview} alt="Profile preview" layout="fill" className="rounded-full object-cover" />
        ) : (
          <Camera size={32} />
        )}
      </button>
      <label className="text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
    </div>
  );
}