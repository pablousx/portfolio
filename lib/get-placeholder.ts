'use server'

import fs from 'fs'
import { getPlaiceholder } from 'plaiceholder'

export interface PlaceholderImage {
  alt: string
  src: string
  [key: string]: unknown
}

export async function getPlaceholder(
  image: PlaceholderImage
): Promise<PlaceholderImage & { placeholder: string }> {
  const buffer = fs.readFileSync(`public/images/${image.src}`)

  const { base64 } = await getPlaiceholder(buffer)

  return { ...image, placeholder: base64 }
}
