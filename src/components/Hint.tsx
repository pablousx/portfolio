'use client'

import styles from '@/styles/Hint.module.css'

import clsx from 'clsx/lite'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const CLICK_TIMEOUT = 1200

type HintVisibility = 'after-click' | 'always' | 'hidden' | 'hover' | 'until-click'

interface HintProps {
  children: ReactNode
  className?: string
  label?: string
  position?: 'bottom' | 'bottom-left' | 'top'
  visibility?: HintVisibility
}

export default function Hint({
  className,
  position = 'top',
  label,
  visibility = 'hover',
  children
}: HintProps) {
  const [clicked, setClicked] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleClick = () => {
    setClicked(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setClicked(false), CLICK_TIMEOUT)
  }

  useEffect(() => {
    return () => {
      clearTimeout(resetTimer.current)
    }
  }, [])

  const isClickControlled = visibility === 'after-click' || visibility === 'until-click'
  return (
    <span
      className={clsx(
        styles.base,
        className,
        'no-select',
        'hint--no-shadow hint--rounded hint--bounce',
        `hint--${position}`,
        (clicked || visibility === 'always') && 'hint--always',
        (label == null ||
          visibility === 'hidden' ||
          (visibility === 'after-click' && !clicked) ||
          (visibility === 'until-click' && clicked)) &&
          styles.hide
      )}
      data-hint={label}
      onPointerUp={isClickControlled ? handleClick : undefined}
    >
      {children}
    </span>
  )
}
