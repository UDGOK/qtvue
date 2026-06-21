import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheFooter from '~/components/layout/TheFooter.vue'

describe('TheFooter', () => {
  it('contains brand name and copyright', () => {
    const w = mount(TheFooter)
    expect(w.text().toLowerCase()).toContain('qtvue')
    expect(w.text()).toMatch(/©/)
  })

  it('links to privacy and terms', () => {
    const w = mount(TheFooter)
    expect(w.find('a[href="/legal/privacy"]').exists()).toBe(true)
    expect(w.find('a[href="/legal/terms"]').exists()).toBe(true)
  })
})
