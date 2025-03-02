'use server'

import fs from 'fs'
import { getPlaiceholder } from 'plaiceholder'

export async function getPlaceholder(image) {
  const buffer = fs.readFileSync(`public/images/${image.src}`)

  const { base64 } = await getPlaiceholder(buffer)

  return { ...image, placeholder: base64 }
}
