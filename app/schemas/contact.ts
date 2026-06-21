import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10, 'Please tell us a bit more (10+ characters)'),
  // Honeypot field — must remain empty. The schema accepts any string so the
  // request validates; the server handler checks this field and silently
  // succeeds (so bots don't learn they were caught).
  website: z.string().optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>
