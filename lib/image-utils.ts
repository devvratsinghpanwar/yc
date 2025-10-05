// lib/image-utils.ts
import { urlForImage } from "@/sanity/lib/image";

interface StartupImageData {
  image?: string;
  imageAsset?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    _type: "image";
  };
}

/**
 * Get the best available image URL for a startup
 * Prioritizes uploaded Sanity assets over external URLs
 */
export function getStartupImageUrl(startup: StartupImageData): string | undefined {
  // First, try to use the uploaded Sanity image asset
  if (startup.imageAsset?.asset?._ref) {
    const sanityImageUrl = urlForImage(startup.imageAsset)?.url();
    if (sanityImageUrl) {
      return sanityImageUrl;
    }
  }
  
  // Fallback to the URL field
  if (startup.image) {
    return startup.image;
  }
  
  return undefined;
}

/**
 * Get a resized startup image URL
 */
export function getStartupImageUrlWithSize(
  startup: StartupImageData, 
  width?: number, 
  height?: number
): string | undefined {
  // First, try to use the uploaded Sanity image asset with sizing
  if (startup.imageAsset?.asset?._ref) {
    let imageBuilder = urlForImage(startup.imageAsset);
    if (width) imageBuilder = imageBuilder?.width(width);
    if (height) imageBuilder = imageBuilder?.height(height);
    const sanityImageUrl = imageBuilder?.url();
    if (sanityImageUrl) {
      return sanityImageUrl;
    }
  }
  
  // Fallback to the URL field (no resizing available)
  if (startup.image) {
    return startup.image;
  }
  
  return undefined;
}
