'use client'

import useAppStore from '@/state/store'
import type { ShowcaseImage } from '@/state/store'
import styles from '@/styles/OpenShowcase.module.css'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

interface OpenShowcaseProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  children: ReactNode
  disable?: boolean
  images?: ShowcaseImage[]
  index?: number
  onIndexChange?: (index: number) => void
}

export default function OpenShowcase({
  className,
  disable = false,
  children,
  images,
  index,
  onIndexChange,
  ...props
}: OpenShowcaseProps) {
  const openShowcase = useAppStore((state) => state.openShowcase)
  const dictionary = useDictionary()

  const { aria } = dictionary

  return disable ? (
    <>{children}</>
  ) : (
    <button
      className={clsx(className, styles.base)}
      type='button'
      title={aria.openShowcase}
      onClick={() => openShowcase({ images, index, onIndexChange })}
      {...props}
    >
      {children}
    </button>
  )
}
