import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(key)
}

export async function sendContactEmail(input: {
  name: string
  email: string
  company?: string
  industry?: string
  message: string
}) {
  const resend = getResend()
  const to = process.env.CONTACT_EMAIL_TO ?? 'hello@qtvue.com'

  return resend.emails.send({
    from: 'qtvue.com <onboarding@resend.dev>',
    to,
    replyTo: input.email,
    subject: `New contact form submission from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company ?? '—'}`,
      `Industry: ${input.industry ?? '—'}`,
      '',
      input.message,
    ].join('\n'),
  })
}
