import useDebouncedCallback from '@/hooks/useDebouncedCallback'
import type { ShowcaseImage } from '@/state/store'
import { useState } from 'react'
import type { UIEvent } from 'react'

const EMPTY_IMAGE: ShowcaseImage = { alt: '', src: '' }

interface UseCarrouselOptions {
  images?: ShowcaseImage[]
  initialIndex?: number
  onImageChange?: (index: number) => void
}

export default function useCarrousel({
  initialIndex = 0,
  images = [],
  onImageChange
}: UseCarrouselOptions) {
  const [selection, setSelection] = useState({
    initialIndex,
    imageIndex: initialIndex
  })
  const imageIndex =
    selection.initialIndex === initialIndex ? selection.imageIndex : initialIndex

  const image = images[imageIndex] ?? EMPTY_IMAGE
  const singleImage = images.length <= 1

  const handleImageChange = (index: number) => {
    if (images.length === 0) return

    const newImageIndex = (index + images.length) % images.length
    setSelection({ initialIndex, imageIndex: newImageIndex })

    onImageChange?.(newImageIndex)
  }

  const onScroll = useDebouncedCallback((event: UIEvent<HTMLElement>) => {
    const { scrollLeft, clientWidth } = event.target as HTMLElement
    const newImageIndex = Math.round(scrollLeft / clientWidth)
    setSelection({ initialIndex, imageIndex: newImageIndex })
  }, 100)

  const resetCarrousel = () => {
    setSelection({ initialIndex, imageIndex: 0 })
  }

  return { image, imageIndex, singleImage, handleImageChange, onScroll, resetCarrousel }
}
