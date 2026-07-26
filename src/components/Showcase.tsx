'use client'

import styles from '@/styles/Showcase.module.css'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef
} from 'react-zoom-pan-pinch'

import Icon from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import IconButton from '@/components/IconButton'
import Image from '@/components/Image'

import useCarrousel from '@/hooks/useCarrousel'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import ICONS from '@/constants/icons'

const initialScale = 1
const defaultImageWidth = 2016
const defaultImageHeight = 1080

export default function Showcase() {
  const ref = useRef<ReactZoomPanPinchRef>(null)
  const { showcase, closeShowcase } = useAppStore()
  const dictionary = useDictionary()

  const { aria } = dictionary

  const [scale, setScale] = useState(initialScale)
  const { open, images, index: initialIndex, onIndexChange } = showcase

  const handleResetTransform = () => {
    ref.current?.resetTransform()
  }

  const { image, imageIndex, singleImage, handleImageChange, resetCarrousel } =
    useCarrousel({
      initialIndex,
      images,
      onImageChange: (newImageIndex) => {
        handleResetTransform()
        if (onIndexChange) onIndexChange(newImageIndex)
      }
    })

  const { alt = '', src = '', height = 0, width = 0, icon, contrast } = image

  const handleClose = () => {
    closeShowcase()
    handleResetTransform()
    resetCarrousel()
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape') handleClose()
    if (event.key === 'ArrowLeft') handleImageChange(imageIndex - 1)
    if (event.key === 'ArrowRight') handleImageChange(imageIndex + 1)
  })

  useEffect(() => {
    if (!open) return

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <dialog
      className={clsx(
        styles.base,
        open && styles.open,
        singleImage && styles.singleImage
      )}
      open={open}
      aria-label={alt || aria.openShowcase}
    >
      <TransformWrapper
        initialScale={initialScale}
        maxScale={2.5}
        minScale={0.6}
        onTransform={(_, { scale: nextScale }) => setScale(nextScale)}
        centerOnInit
        centerZoomedOut
        ref={ref}
      >
        <div className={styles.overlay}>
          <button
            className={styles.backdrop}
            type='button'
            aria-label={aria.close}
            onClick={handleClose}
            tabIndex={open ? 0 : -1}
          />
          <header>
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
          <div>
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
                  <Icon
                    src={(src in ICONS ? src : 'missing') as IconName}
                    alt={alt}
                    aria-hidden={!open}
                    lightColor={contrast}
                  />
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
          <footer>
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
    </dialog>
  )
}
