'use client'

import styles from '@/styles/Link.module.css'

import buttonStyles from '@/styles/Button.module.css'
import clsx from 'clsx/lite'
import { default as NextLink } from 'next/link'
import type { ComponentProps } from 'react'

const classNameByVariant = {
  primary: `${buttonStyles.primary} interactive-button-primary`,
  secondary: `${buttonStyles.secondary} interactive-border`
} as const

type NextLinkProps = ComponentProps<typeof NextLink>

export interface LinkProps extends Omit<NextLinkProps, 'href'> {
  asButton?: boolean
  decoration?: boolean
  href?: NextLinkProps['href']
  isExternal?: boolean
  locale?: string
  variant?: keyof typeof classNameByVariant
}

export default function Link({
  className,
  title,
  href = '#',
  locale,
  replace = false,
  prefetch = false,
  isExternal = false,
  decoration = true,
  children,
  asButton = false,
  variant,
  ...props
}: LinkProps) {
  return (
    <NextLink
      replace={replace}
      prefetch={prefetch}
      className={clsx(
        className,
        asButton ? buttonStyles.base : styles.base,
        asButton && 'no-select',
        variant && classNameByVariant[variant],
        decoration && styles.decoration
      )}
      title={title}
      href={href}
      locale={locale}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? ' noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </NextLink>
  )
}
