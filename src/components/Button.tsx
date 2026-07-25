'use client'

import styles from '@/styles/Button.module.css'

import clsx from 'clsx/lite'
import type { ComponentPropsWithRef } from 'react'

const classNameByVariant = {
  primary: `${styles.primary} interactive-button-primary`,
  secondary: `${styles.secondary} interactive-border`
} as const

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
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
  ref,
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
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
}
