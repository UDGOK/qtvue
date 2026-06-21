import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheHeader from '~/components/layout/TheHeader.vue'

describe('TheHeader', () => {
  it('renders the logo and nav keys via t()', () => {
    const w = mount(TheHeader)
    expect(w.text().toLowerCase()).toContain('qtvue')
    // useI18n stub returns the key, so we check for the nav keys.
    expect(w.text()).toContain('nav.services')
    expect(w.text()).toContain('nav.work')
  })

  it('renders a contact CTA linking to /contact', () => {
    const w = mount(TheHeader)
    expect(w.find('a[href="/contact"]').exists()).toBe(true)
  })
})
