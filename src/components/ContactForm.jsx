'use client'
import styles from '@/styles/ContactForm.module.css'
import { useEffect, useRef, useState } from 'react'

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

export default function ContactForm({ children }) {
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
  const [error, setError] = useState()

  const formRef = useRef(null)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setTimeout(() => {
      handleChange()
    }, 500)
  }

  const handleChange = () => {
    setSuccess(false)
    setError()
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    setSending(true)
    setError()

    const formData = new FormData(ev.target)
    const formObject = Object.fromEntries(formData)
    formObject.name ||= nameDefault
    formObject.subject ||= subjectDefault

    fetch('/send-email', {
      method: 'POST',
      body: JSON.stringify(formObject)
    })
      .then((response) => {
        if (response.ok === false) throw response

        setSuccess(true)
      })
      .catch((error) => {
        const status = error.status
        setError(
          status === 400
            ? error400Message
            : status === 500
              ? error500Message
              : errorMessage
        )
      })
      .finally(() => {
        setSending(false)
      })
  }

  useEffect(() => {
    if (!isFocused) return

    const handleKeyDown = (ev) => {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter')
        formRef.current.requestSubmit()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocused])

  return (
    <form
      ref={formRef}
      className={styles.base}
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
          placeholder='keanureeves@company.com'
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
        <Hint position='bottom' label={successTooltip} hideAlways showAlways={success}>
          <Button type='submit' variant='primary' disabled={success} loading={sending}>
            {submitButton}
            <Icon src='send' backgroundColor />
          </Button>
        </Hint>
      </footer>
    </form>
  )
}
