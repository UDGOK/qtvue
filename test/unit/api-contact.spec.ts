import { describe, it, expect } from 'vitest'
import { contactSchema } from '~/schemas/contact'

// Validates the input shape the server endpoint will accept.
describe('contact endpoint input contract', () => {
  it('accepts a valid payload', () => {
    const r = contactSchema.safeParse({
      name: 'Alice',
      email: 'a@b.co',
      message: 'We want a welding cell.',
    })
    expect(r.success).toBe(true)
  })

  it('accepts a honeypot value at the schema level (handler silently drops it)', () => {
    // Schema must not reject honeypot payloads — that would tell bots they were
    // caught. The server handler inspects this field and returns ok=true silently.
    const r = contactSchema.safeParse({
      name: 'Alice',
      email: 'a@b.co',
      message: 'We want a welding cell.',
      website: 'http://spam.com',
    })
    expect(r.success).toBe(true)
  })
})
