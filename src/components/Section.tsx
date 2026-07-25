import styles from '@/styles/Section.module.css'
import clsx from 'clsx/lite'
import type { ReactNode } from 'react'

interface SectionProps {
  as?: 'header' | 'section'
  background?: boolean
  children: ReactNode
  className?: string
  id?: string
  title?: string
}

export default function Section({
  background = true,
  as: Tag = 'section',
  className,
  id,
  title,
  children
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={clsx(className, styles.base, background && styles.background)}
    >
      {title && <h2>{title}</h2>}
      {children}
    </Tag>
  )
}
