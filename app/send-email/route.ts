import {
  EMAIL_MAX_LENGTH,
  EMAIL_PATTERN,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH
} from '@/constants/patterns'
import getDictionary, { getCurrentLocale } from 'i18n/server'
import nodemailer from 'nodemailer'

interface ContactFormData {
  email: string
  message: string
  name: string
  subject: string
}

const isContactFormData = (value: unknown): value is ContactFormData => {
  if (value === null || typeof value !== 'object') return false

  const data = value as Record<string, unknown>
  return ['email', 'message', 'name', 'subject'].every(
    (field) => typeof data[field] === 'string'
  )
}

const sanitize = (value: string) =>
  value.replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;')

export async function POST(request: Request) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number.parseInt(process.env.SMTP_PORT ?? '587', 10)
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const smtpEmail = process.env.SMTP_FROM
  const destinationEmail = process.env.MY_EMAIL

  if (
    !smtpHost ||
    !smtpUser ||
    !smtpPassword ||
    !smtpEmail ||
    !destinationEmail ||
    !Number.isInteger(smtpPort) ||
    smtpPort < 1 ||
    smtpPort > 65_535
  ) {
    return new Response(null, { status: 503 })
  }

  try {
    const [locale, dictionary, data] = await Promise.all([
      getCurrentLocale(),
      getDictionary('email'),
      request.json() as Promise<unknown>
    ])
    const { subject: cxSubject, html: cxHtml } = dictionary

    if (!isContactFormData(data)) return new Response(null, { status: 400 })

    const email = sanitize(data.email)
    const name = sanitize(data.name)
    const subject = sanitize(data.subject)
    const message = sanitize(data.message)

    if (
      EMAIL_PATTERN.test(email) === false ||
      email.length > EMAIL_MAX_LENGTH ||
      name.length > NAME_MAX_LENGTH ||
      subject.length > SUBJECT_MAX_LENGTH ||
      message.length > MESSAGE_MAX_LENGTH
    )
      return new Response(null, { status: 400 })

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPassword
      }
    })

    await Promise.all([
      transporter.sendMail({
        from: smtpEmail,
        to: email,
        subject: cxSubject,
        html: cxHtml.replaceAll('{{name}}', name)
      }),
      transporter.sendMail({
        from: smtpEmail,
        to: destinationEmail,
        subject: `[Portfolio] Nuevo mensaje de ${name}: ${subject}`,
        html: `
          <p><strong>Versión:</strong> ${locale}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p>${message.replaceAll('\n', '<br/>')}</p>
        `
      })
    ])

    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
