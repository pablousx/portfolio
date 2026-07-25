'use client'

import styles from '@/styles/IconButton.module.css'

import Icon from '@/components/Icon'
import type { IconProps } from '@/components/Icon'
import clsx from 'clsx/lite'
import type { ComponentPropsWithoutRef } from 'react'

interface IconButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'title' | 'type'
> {
  iconProps?: Omit<IconProps, 'src'>
  src: IconProps['src']
  title: string
}

export default function IconButton({
  className,
  title,
  onClick,
  src,
  iconProps,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={clsx(className, styles.base)}
      type='button'
      title={title}
      aria-label={title}
      onClick={onClick}
      {...props}
    >
      <Icon src={src} {...iconProps} />
    </button>
  )
}
