'use client'

import styles from '@/styles/Button.module.css'

import clsx from 'clsx/lite'
import type { ComponentPropsWithoutRef } from 'react'

const classNameByVariant = {
  primary: `${styles.primary} interactive-button-primary`,
  secondary: `${styles.secondary} interactive-border`
} as const

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  loading?: boolean
  variant?: keyof typeof classNameByVariant
}

export default function Button({
  className,
  type = 'button',
  variant,
  onClick,
  children,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        className,
        styles.base,
        variant && classNameByVariant[variant],
        disabled && styles.disabled,
        loading && styles.loading,
        'no-select'
      )}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  )
}
