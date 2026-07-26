'use client'
import styles from '@/styles/ContactForm.module.css'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import useDebouncedCallback from '@/hooks/useDebouncedCallback'

import Button from '@/components/Button'
import Hint from '@/components/Hint'
import Icon from '@/components/Icon'
import Input from '@/components/Input'
import {
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH
} from '@/constants/patterns'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import RichText from '@/components/RichText'

const CONTACT_FORM_STORAGE_KEY = 'contact-form:v1'

interface ContactFormPayload {
  email: string
  message: string
  name: string
  subject: string
}

type ContactFormDraft = Record<keyof ContactFormPayload, string>

const formDataToPayload = (formData: FormData): ContactFormPayload => {
  const getString = (field: keyof ContactFormPayload) => {
    const value = formData.get(field)
    return typeof value === 'string' ? value : ''
  }

  return {
    email: getString('email'),
    message: getString('message'),
    name: getString('name'),
    subject: getString('subject')
  }
}

const isContactFormDraft = (value: unknown): value is ContactFormDraft => {
  if (value === null || typeof value !== 'object') return false

  const draft = value as Record<string, unknown>
  return ['email', 'message', 'name', 'subject'].every(
    (field) => typeof draft[field] === 'string'
  )
}

const submitContactForm = async (formObject: ContactFormPayload) => {
  try {
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formObject)
    })

    return response.status
  } catch {
    return 0
  }
}

interface ContactFormProps {
  children: ReactNode
  label: string
}

export default function ContactForm({ children, label }: ContactFormProps) {
  const { form } = useDictionary('contact')
  const {
    emailLabel,
    nameLabel,
    nameDefault,
    subjectLabel,
    subjectPlaceholder,
    subjectDefault,
    messageLabel,
    messagePlaceholder,
    submitButton,
    requiredLabel,
    hint,
    successMessage,
    successTooltip,
    error400Message,
    error500Message,
    errorMessage
  } = form

  const [isFocused, setIsFocused] = useState(false)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string>()

  const formRef = useRef<HTMLFormElement>(null)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    clearTimeout(blurTimer.current)
    blurTimer.current = setTimeout(() => {
      handleChange()
    }, 500)
  }

  const saveToLocalStorage = (data: ContactFormDraft) => {
    localStorage.setItem(CONTACT_FORM_STORAGE_KEY, JSON.stringify(data))
  }

  const debouncedSave = useDebouncedCallback(saveToLocalStorage, 500)

  const handleChange = () => {
    setSuccess(false)
    setError(undefined)

    if (!formRef.current) return

    const data = formDataToPayload(new FormData(formRef.current))
    debouncedSave(data)
  }

  const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (sending) return

    setSending(true)
    setError(undefined)

    const formObject = formDataToPayload(new FormData(ev.currentTarget))
    formObject.name = formObject.name || nameDefault
    formObject.subject = formObject.subject || subjectDefault

    submitContactForm(formObject).then((status) => {
      if (status >= 200 && status < 300) {
        setSuccess(true)
        localStorage.removeItem(CONTACT_FORM_STORAGE_KEY)
      } else {
        setError(
          status === 400
            ? error400Message
            : status === 500
              ? error500Message
              : errorMessage
        )
      }

      setSending(false)
      return status
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem(CONTACT_FORM_STORAGE_KEY)
    if (saved) {
      try {
        const data: unknown = JSON.parse(saved)
        if (!isContactFormDraft(data) || !formRef.current) return

        for (const [key, value] of Object.entries(data)) {
          const element = formRef.current.elements.namedItem(key)
          if (
            element instanceof HTMLInputElement ||
            element instanceof HTMLTextAreaElement
          ) {
            element.value = value
          }
        }
      } catch (storageError) {
        console.error('Failed to load form data from local storage', storageError)
      }
    }
  }, [])

  useEffect(() => {
    return () => clearTimeout(blurTimer.current)
  }, [])

  useEffect(() => {
    if (!isFocused) return

    const handleKeyDown = (ev: KeyboardEvent) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter')
        formRef.current?.requestSubmit()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused])

  return (
    <form
      ref={formRef}
      className={styles.base}
      aria-label={label}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <header>
        {children}
        <b className={styles.requiredLabel}>{requiredLabel}</b>
      </header>
      <div className={clsx(styles.row, styles.row_3_2)}>
        <Input
          type='email'
          label={emailLabel}
          name='email'
          placeholder='keanureeves@matrix.com'
          required
          maxLength={EMAIL_MAX_LENGTH}
          autoComplete='email'
        />
        <Input
          label={nameLabel}
          name='name'
          placeholder='Keanu Reeves'
          maxLength={NAME_MAX_LENGTH}
          autoComplete='name'
        />
      </div>
      <Input
        label={subjectLabel}
        name='subject'
        placeholder={subjectPlaceholder}
        maxLength={SUBJECT_MAX_LENGTH}
      />
      <Input
        textarea
        label={messageLabel}
        name='message'
        placeholder={messagePlaceholder}
        required
        maxLength={MESSAGE_MAX_LENGTH}
      />
      <footer>
        <RichText as='p' className={clsx((sending || !isFocused) && styles.hidden)}>
          {success ? successMessage : error || hint}
        </RichText>
        <Hint
          position='bottom'
          label={successTooltip}
          visibility={success ? 'always' : 'hidden'}
        >
          <Button type='submit' variant='primary' disabled={success} loading={sending}>
            {submitButton}
            <Icon src='send' backgroundColor />
          </Button>
        </Hint>
      </footer>
    </form>
  )
}
