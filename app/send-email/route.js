import {
  EMAIL_MAX_LENGTH,
  EMAIL_PATTERN,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SUBJECT_MAX_LENGTH
} from '@/constants/patterns'
import { sendEmail } from 'lib/send-email'

export async function POST(request) {
  const data = await request.json()
  const { email, name, subject, message } = data

  try {
    if (
      EMAIL_PATTERN.test(email) === false ||
      email.length > EMAIL_MAX_LENGTH ||
      name.length > NAME_MAX_LENGTH ||
      subject.length > SUBJECT_MAX_LENGTH ||
      message.length > MESSAGE_MAX_LENGTH
    )
      return new Response(null, { status: 400 })

    const html = `Solicitud de contacto:
    <p><strong>Correo:</strong> ${email}</p>
    <p><strong>Nombre:</strong> ${name}</p>
    <p>${message.replace('\n', '<br/>')}</p>
    `

    await sendEmail({
      subject,
      html
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(error, { status: 500 })
  }
}
