import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Logo from '~/components/marketing/Logo.vue'

describe('Logo', () => {
  it('renders wordmark variant by default', () => {
    const w = mount(Logo)
    expect(w.text().toLowerCase()).toContain('qtvue')
  })

  it('renders an svg', () => {
    const w = mount(Logo)
    expect(w.find('svg').exists()).toBe(true)
  })

  it('respects the variant prop', () => {
    const w = mount(Logo, { props: { variant: 'monogram' } })
    expect(w.attributes('data-variant')).toBe('monogram')
  })
})
