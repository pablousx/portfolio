import {
  EMAIL_MAX_LENGTH,
  EMAIL_PATTERN,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH
} from '@/constants/patterns'
import getDictionary from 'i18n/server'
import { sendEmail } from 'lib/send-email'

const EMAIL = process.env.SMTP_EMAIL

const sanitize = (str) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function POST(request) {
  const dictionary = await getDictionary('email')
  const { subject: cxSubject, html: cxHtml } = dictionary

  const data = await request.json()
  let { email, name, subject, message } = data
  email = sanitize(email)
  name = sanitize(name)
  subject = sanitize(subject)
  message = sanitize(message)

  try {
    if (
      EMAIL_PATTERN.test(email) === false ||
      email.length > EMAIL_MAX_LENGTH ||
      name.length > NAME_MAX_LENGTH ||
      subject.length > SUBJECT_MAX_LENGTH ||
      message.length > MESSAGE_MAX_LENGTH
    )
      return new Response(null, { status: 400 })

    Promise.all([
      await sendEmail({
        to: email,
        subject: cxSubject,
        html: cxHtml.replace('{{name}}', name)
      }),

      await sendEmail({
        to: EMAIL,
        subject,
        html: `Solicitud de contacto:
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Nombre:</strong> ${name}</p>
          <p>${message.replace('\n', '<br/>')}</p>
        `
      })
    ])

    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}
