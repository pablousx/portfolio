import nodemailer from 'nodemailer'

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
}

export const sendEmail = async ({ subject, html, to }) => {
  const transporter = nodemailer.createTransport(smtpConfig)

  return await transporter.sendMail({
    from: `"Pablo Pineda" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  })
}
