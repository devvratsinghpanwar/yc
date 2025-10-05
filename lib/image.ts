// sanity/lib/image.ts
import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
})

export const urlForImage = (source: Image | undefined) => {
  // Ensure that source image has a valid asset ref for URL generation
  if (!source?.asset?._ref) {
    return undefined
  }
  return imageBuilder?.image(source).auto('format').fit('max')
}