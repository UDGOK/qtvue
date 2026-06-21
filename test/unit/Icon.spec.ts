import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Icon from '~/components/ui/Icon.vue'

describe('Icon', () => {
  it('renders an svg for a known icon name', () => {
    const w = mount(Icon, { props: { name: 'ArrowRight' } })
    expect(w.find('svg').exists()).toBe(true)
  })

  it('renders nothing for an unknown icon name (no throw)', () => {
    const w = mount(Icon, { props: { name: 'DefinitelyNotAnIcon' } })
    expect(w.find('svg').exists()).toBe(false)
  })
})
