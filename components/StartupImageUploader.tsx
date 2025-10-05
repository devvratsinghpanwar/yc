// components/StartupImageUploader.tsx
"use client";

import { useState, useRef } from 'react';
import { sanityClient } from '@/lib/sanity-client';
import { Camera, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface StartupImageUploaderProps {
  onUploadSuccess: (assetId: string, imageUrl: string) => void;
  onRemove: () => void;
  currentImageUrl?: string;
}

export default function StartupImageUploader({ 
  onUploadSuccess, 
  onRemove, 
  currentImageUrl 
}: StartupImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

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
      // Use the asset's URL directly from Sanity
      const imageUrl = asset.url;
      onUploadSuccess(asset._id, imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Image upload failed. Please try again.');
      setPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, image/jpg"
      />
      
      {preview ? (
        <div className="relative w-full max-w-md mx-auto">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
            <Image 
              src={preview} 
              alt="Startup image preview" 
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <div 
          onClick={handleClick}
          className="w-full max-w-md mx-auto h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-300 hover:bg-gray-50 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 text-center">
                Click to upload startup image
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">
                PNG, JPG, WEBP up to 5MB
              </p>
            </>
          )}
        </div>
      )}
      
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isLoading}
          className="w-full max-w-md mx-auto"
        >
          <Camera className="h-4 w-4 mr-2" />
          Choose Image
        </Button>
      )}
    </div>
  );
}
