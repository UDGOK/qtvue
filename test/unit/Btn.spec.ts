import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Btn from '~/components/ui/Btn.vue'

const stub = (props: Record<string, unknown> = {}) =>
  mount(Btn, { props: { ...props }, slots: { default: 'Click' } })

describe('Btn', () => {
  it('renders as <a> when href is provided', () => {
    const w = stub({ href: '/x' })
    expect(w.element.tagName).toBe('A')
  })

  it('renders as <button> when no href', () => {
    const w = stub()
    expect(w.element.tagName).toBe('BUTTON')
  })

  it('applies primary variant classes by default', () => {
    const w = stub()
    expect(w.classes().toString()).toMatch(/bg-primary/)
  })

  it('sets data-variant to ghost when variant=ghost', () => {
    const w = stub({ variant: 'ghost' })
    expect(w.attributes('data-variant')).toBe('ghost')
  })

  it('disables when disabled prop is true', () => {
    const w = stub({ disabled: true })
    expect(w.attributes('disabled')).toBeDefined()
  })
})
