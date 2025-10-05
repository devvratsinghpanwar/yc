import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlForImage = (source: SanityImageSource) => {
  // Handle null/undefined sources to prevent errors
  if (!source) {
    return undefined
  }

  // For image objects, check if they have a valid asset reference
  if (typeof source === 'object' && 'asset' in source && !source.asset?._ref) {
    return undefined
  }

  return builder.image(source)
}
