'use client'

import styles from '@/styles/Showcase.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

import Icon from '@/components/Icon'
import IconButton from '@/components/IconButton'
import Image from '@/components/Image'

import useCarrousel from '@/hooks/useCarrousel'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'

const initialScale = 1
const defaultImageWidth = 2016
const defaultImageHeight = 1080

export default function Showcase() {
  const ref = useRef()
  const { showcase, closeShowcase } = useAppStore()
  const dictionary = useDictionary()

  const { aria } = dictionary

  const [scale, setScale] = useState(initialScale)
  const { open, images, index: initialIndex, onIndexChange } = showcase

  const { image, imageIndex, singleImage, handleImageChange, resetCarrousel } =
    useCarrousel({
      initialIndex,
      images,
      onImageChange: (newImageIndex) => {
        handleResetTransform()
        if (onIndexChange) onIndexChange(newImageIndex)
      }
    })

  const { alt, src, height, width, icon, contrast } = image

  const handleClose = useCallback(() => {
    closeShowcase()
    handleResetTransform()
    resetCarrousel()
  }, [closeShowcase, ref, resetCarrousel])

  const handleResetTransform = useCallback(() => {
    ref.current?.resetTransform()
  }, [])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (ev) => {
      if (ev.key === 'Escape') handleClose()
      if (ev.key === 'ArrowLeft') handleImageChange(imageIndex - 1)
      if (ev.key === 'ArrowRight') handleImageChange(imageIndex + 1)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, imageIndex, handleClose, handleImageChange])

  return (
    <div
      className={clsx(
        styles.base,
        open && styles.open,
        singleImage && styles.singleImage
      )}
    >
      <TransformWrapper
        initialScale={initialScale}
        maxScale={2.5}
        minScale={0.6}
        onTransformed={(_, { scale }) => setScale(scale)}
        centerOnInit
        centerZoomedOut
        ref={ref}
      >
        <div className={styles.overlay} onClick={handleClose}>
          <header onClick={(ev) => ev.stopPropagation()}>
            {!singleImage && (
              <span className={styles.imageIndex}>
                {imageIndex + 1}/{images?.length}
              </span>
            )}
            <p>{alt}</p>
            <IconButton
              src='close'
              iconProps={{ lightColor: true }}
              title={aria.close}
              className={styles.closeButton}
              onClick={handleClose}
            />
          </header>
          <div onClick={(ev) => ev.stopPropagation()}>
            <IconButton
              src='arrow'
              iconProps={{ lightColor: true }}
              title={aria.previousImage}
              className={styles.previousImage}
              onClick={() => handleImageChange(imageIndex - 1)}
              tabIndex={open ? 0 : -1}
            />
            <TransformComponent wrapperClass={clsx(styles.canvas, icon && styles.icon)}>
              {image.src &&
                (icon ? (
                  <Icon src={src} alt={alt} aria-hidden={!open} lightColor={contrast} />
                ) : (
                  <Image
                    src={src}
                    alt={alt}
                    aria-hidden={!open}
                    height={(height * defaultImageWidth) / width || defaultImageHeight}
                    width={defaultImageWidth}
                    zoom={false}
                  />
                ))}
            </TransformComponent>
            <IconButton
              src='arrow'
              iconProps={{ lightColor: true }}
              title={aria.nextImage}
              className={styles.nextImage}
              onClick={() => handleImageChange(imageIndex + 1)}
              tabIndex={open ? 0 : -1}
            />
          </div>
          <footer onClick={(ev) => ev.stopPropagation()}>
            <IconButton
              className={styles.zoomOut}
              src='minus'
              iconProps={{ lightColor: true, border: true }}
              title={aria.zoomOut}
              onClick={() => ref.current?.zoomOut(0.2)}
            />
            <button
              type='button'
              className={styles.zoomLabel}
              onClick={handleResetTransform}
              title={aria.zoomReset}
            >
              <p>{(scale * 100).toFixed(0)}%</p>
              <Icon src='zoom' lightColor />
            </button>
            <IconButton
              className={styles.zoomIn}
              src='plus'
              iconProps={{ lightColor: true, border: true }}
              title={aria.zoomIn}
              onClick={() => ref.current?.zoomIn(0.2)}
            />
          </footer>
        </div>
      </TransformWrapper>
    </div>
  )
}
