'use client'
import Hint from '@/components/Hint'
import styles from '@/styles/Input.module.css'

import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import type { HTMLInputAutoCompleteAttribute } from 'react'

interface InputProps {
  autoComplete?: HTMLInputAutoCompleteAttribute
  defaultValue?: string
  label: string
  maxLength?: number
  name: string
  pattern?: string
  placeholder?: string
  required?: boolean
  textarea?: boolean
  type?: 'email' | 'text'
}

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  textarea = false,
  required = false,
  maxLength,
  pattern,
  defaultValue,
  autoComplete
}: InputProps) {
  const { form } = useDictionary('contact')
  const { requiredLabel } = form

  return (
    <label htmlFor={name} className={clsx(styles.base, 'interactive-border')}>
      <Hint
        className={clsx(styles.label, 'interactive-text')}
        label={required ? requiredLabel : undefined}
      >
        <b>{label}</b>
      </Hint>
      {textarea ? (
        <textarea
          id={name}
          className={styles.input}
          name={name}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          defaultValue={defaultValue}
          rows={4}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          id={name}
          className={styles.input}
          name={name}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          pattern={pattern}
          defaultValue={defaultValue}
          type={type}
          autoComplete={autoComplete}
        />
      )}
    </label>
  )
}
