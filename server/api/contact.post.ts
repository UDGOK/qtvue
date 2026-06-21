import { contactSchema } from '../../app/schemas/contact'
import { sendContactEmail } from '../utils/resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Validation failed' })
  }

  // Honeypot: silently succeed so bots don't learn they were caught.
  if (parsed.data.website) {
    return { ok: true }
  }

  try {
    await sendContactEmail(parsed.data)
    return { ok: true }
  } catch (e) {
    console.error('Contact form error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }
})
