import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Section from '~/components/ui/Section.vue'

describe('Section', () => {
  it('renders eyebrow, heading, and slot', () => {
    const wrapper = mount(Section, {
      props: { eyebrow: 'Services', heading: 'What we do' },
      slots: { default: '<p>body</p>' },
    })
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('What we do')
    expect(wrapper.text()).toContain('body')
  })
})
