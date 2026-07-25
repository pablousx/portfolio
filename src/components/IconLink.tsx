'use client'

import styles from '@/styles/IconButton.module.css'

import Icon from '@/components/Icon'
import type { IconProps } from '@/components/Icon'
import Link, { type LinkProps } from '@/components/Link'
import clsx from 'clsx/lite'

interface IconLinkProps extends Omit<LinkProps, 'children'> {
  iconProps?: Omit<IconProps, 'src'>
  src: IconProps['src']
  title: string
}

export default function IconLink({
  className,
  title,
  src,
  iconProps,
  ...props
}: IconLinkProps) {
  return (
    <Link
      className={clsx(className, styles.base)}
      title={title}
      aria-label={title}
      decoration={false}
      {...props}
    >
      <Icon src={src} {...iconProps} />
    </Link>
  )
}
