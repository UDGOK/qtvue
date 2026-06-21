import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContactForm } from '~/composables/useContactForm'

describe('useContactForm', () => {
  beforeEach(() => vi.resetAllMocks())

  it('starts idle with no errors', () => {
    const { status, errors } = useContactForm()
    expect(status.value).toBe('idle')
    expect(Object.keys(errors.value).length).toBe(0)
  })

  it('rejects an invalid submission and sets errors', async () => {
    const { submit, status, errors } = useContactForm()
    await submit({ name: 'x', email: 'bad', message: 'short' })
    expect(status.value).toBe('error')
    expect(errors.value.email).toBeDefined()
  })

  it('succeeds on valid input', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response)
    vi.stubGlobal('fetch', fetchMock)
    const { submit, status } = useContactForm()
    await submit({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'We need a welding cell.',
    })
    expect(status.value).toBe('success')
    expect(fetchMock).toHaveBeenCalled()
  })
})
