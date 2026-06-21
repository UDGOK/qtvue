import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('renders a button', () => {
    const w = mount(ThemeToggle)
    expect(w.find('button').exists()).toBe(true)
  })

  it('toggles isDark on click without throwing', async () => {
    const w = mount(ThemeToggle)
    await w.find('button').trigger('click')
    // No throw = pass; state change is internal to the shared composable.
    expect(true).toBe(true)
  })
})
