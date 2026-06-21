import { ref } from 'vue'
import { contactSchema, type ContactInput } from '~/schemas/contact'

export type Status = 'idle' | 'submitting' | 'success' | 'error'

export function useContactForm() {
  const status = ref<Status>('idle')
  const errors = ref<Record<string, string>>({})

  async function submit(input: Partial<ContactInput>) {
    status.value = 'submitting'
    errors.value = {}

    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      status.value = 'error'
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      errors.value = fieldErrors
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) throw new Error('request failed')
      status.value = 'success'
    } catch {
      status.value = 'error'
      errors.value = { _form: 'Something went wrong. Please try again.' }
    }
  }

  return { status, errors, submit }
}
