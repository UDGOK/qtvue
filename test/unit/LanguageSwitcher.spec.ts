import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

describe('LanguageSwitcher', () => {
  it('renders no select when only one locale is available', () => {
    const w = mount(LanguageSwitcher, { props: { locales: ['en'] } })
    expect(w.find('select').exists()).toBe(false)
  })

  it('renders a select when more than one locale', () => {
    const w = mount(LanguageSwitcher, {
      props: { locales: ['en', 'es'], current: 'en' },
    })
    expect(w.find('select').exists()).toBe(true)
    expect(w.findAll('option').length).toBe(2)
  })
})
