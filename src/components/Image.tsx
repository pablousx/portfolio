import styles from '@/styles/Image.module.css'
import clsx from 'clsx/lite'
import { default as NextImage } from 'next/image'
import type { ImageProps as NextImageProps } from 'next/image'

import OpenShowcase from '@/components/OpenShowcase'

export interface ImageProps extends Omit<
  NextImageProps,
  'alt' | 'blurDataURL' | 'placeholder' | 'src'
> {
  alt: string
  border?: boolean
  className?: string
  placeholder?: string
  src: string
  zoom?: boolean
}

export default function Image({
  src,
  alt,
  height,
  width,
  placeholder,
  fill = false,
  priority = false,
  className,
  border = false,
  zoom = false,
  ...props
}: ImageProps) {
  return (
    <OpenShowcase disable={!zoom} images={[{ src, alt }]}>
      <NextImage
        src={`/images/${src}`}
        alt={alt}
        className={clsx(
          className,
          styles.base,
          border && `${styles.border} interactive-border`
        )}
        height={height}
        width={width}
        fill={fill}
        priority={priority}
        placeholder={placeholder == null ? undefined : 'blur'}
        blurDataURL={placeholder}
        {...props}
      />
    </OpenShowcase>
  )
}
