import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheHeader from '~/components/layout/TheHeader.vue'

describe('TheHeader', () => {
  it('renders the logo and nav links', () => {
    const w = mount(TheHeader)
    expect(w.text().toLowerCase()).toContain('qtvue')
    expect(w.text()).toContain('Services')
    expect(w.text()).toContain('Work')
    expect(w.text()).toContain('Contact')
  })

  it('renders a contact CTA linking to /contact', () => {
    const w = mount(TheHeader)
    expect(w.find('a[href="/contact"]').exists()).toBe(true)
  })
})
