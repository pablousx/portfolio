'use client'

import styles from '@/styles/ImageCarrousel.module.css'
import { useRef } from 'react'

import IconButton from '@/components/IconButton'
import Image from '@/components/Image'
import OpenShowcase from '@/components/OpenShowcase'
import useCarrousel from '@/hooks/useCarrousel'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import type { ImageData } from '@/types/content'

interface ImageCarrouselProps {
  border?: boolean
  className?: string
  height: number
  images: ImageData[]
  width: number
  zoom?: boolean
}

export default function ImageCarrousel({
  className,
  images,
  height,
  width,
  border = false,
  zoom = true
}: ImageCarrouselProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { aria } = useDictionary()
  const { imageIndex, singleImage, handleImageChange, onScroll } = useCarrousel({
    images,
    onImageChange: (newImageIndex) => {
      contentRef.current?.scrollTo({
        left: (contentRef.current?.clientWidth ?? 0) * newImageIndex,
        behavior: 'smooth'
      })
    }
  })

  return (
    <div
      className={clsx(
        className,
        styles.base,
        border && `${styles.border} interactive-border`,
        singleImage && styles.singleImage
      )}
    >
      <IconButton
        src='arrow'
        iconProps={{ lightColor: true }}
        title={aria.previousImage}
        className={styles.previousImage}
        onClick={(ev) => {
          ev.stopPropagation()
          handleImageChange(imageIndex - 1)
        }}
      />
      <OpenShowcase
        className={styles.showcase}
        disable={!zoom}
        images={images}
        index={imageIndex}
        onIndexChange={handleImageChange}
      >
        <div
          className={styles.content}
          ref={contentRef}
          onScroll={onScroll}
          style={{
            width: `clamp(100%, ${width}px, 100%)`,
            aspectRatio: Math.fround(width / height)
          }}
        >
          {images.map((image) => (
            <Image
              key={image.src}
              {...image}
              height={height}
              width={width}
              zoom={false}
            />
          ))}
        </div>
      </OpenShowcase>
      <IconButton
        src='arrow'
        iconProps={{ lightColor: true }}
        className={styles.nextImage}
        onClick={(ev) => {
          ev.stopPropagation()
          handleImageChange(imageIndex + 1)
        }}
        title={aria.nextImage}
      />
      <div className={styles.dots}>
        {images.map((image, index) => (
          <span
            key={image.src}
            className={clsx(styles.dot, imageIndex === index && styles.selected)}
          >
            <button
              type='button'
              title={`${aria.seeImage} ${index + 1}`}
              aria-label={`${aria.seeImage} ${index + 1}`}
              onClick={(ev) => {
                ev.stopPropagation()
                handleImageChange(index)
              }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
