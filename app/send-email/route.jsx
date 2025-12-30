import {
  EMAIL_MAX_LENGTH,
  EMAIL_PATTERN,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH
} from '@/constants/patterns'
import getDictionary, { getCurrentLocale } from 'i18n/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const RESEND_EMAIL = process.env.RESEND_EMAIL
const MY_EMAIL = process.env.MY_EMAIL

const sanitize = (str) => str.replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;')

export async function POST(request) {
  const locale = await getCurrentLocale()
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
      resend.emails.send({
        from: RESEND_EMAIL,
        to: email,
        subject: cxSubject,
        html: cxHtml.replaceAll('{{name}}', name)
      }),
      resend.emails.send({
        from: RESEND_EMAIL,
        to: MY_EMAIL,
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
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}
