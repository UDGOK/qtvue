import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Container from '~/components/ui/Container.vue'

describe('Container', () => {
  it('renders its slot content', () => {
    const wrapper = mount(Container, { slots: { default: '<p>hi</p>' } })
    expect(wrapper.text()).toBe('hi')
  })

  it('applies max-width class', () => {
    const wrapper = mount(Container)
    expect(wrapper.classes().some((c) => c.includes('max-w'))).toBe(true)
  })
})
