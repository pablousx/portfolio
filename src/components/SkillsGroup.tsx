'use client'

import styles from '@/styles/SkillsGroup.module.css'
import clsx from 'clsx/lite'

import { useRef, type ReactNode } from 'react'

interface SkillsGroupProps {
  children: ReactNode
  name: string
}

export default function SkillsGroup({ name, children }: SkillsGroupProps) {
  const ref = useRef(null)

  return (
    <article ref={ref} className={clsx(styles.base, 'interactive-border')}>
      <h3 className='interactive-text'>{name}</h3>
      <div className={styles.skills}>{children}</div>
    </article>
  )
}
