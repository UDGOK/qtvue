import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Card from '~/components/ui/Card.vue'
import Badge from '~/components/ui/Badge.vue'
import Stat from '~/components/ui/Stat.vue'

describe('Card', () => {
  it('renders slot', () => {
    const w = mount(Card, { slots: { default: 'x' } })
    expect(w.text()).toBe('x')
  })
  it('has rounded border surface styling', () => {
    const w = mount(Card)
    expect(w.classes().toString()).toMatch(/border|surface/)
  })
})

describe('Badge', () => {
  it('renders text', () => {
    const w = mount(Badge, { props: { text: 'Welding' } })
    expect(w.text()).toBe('Welding')
  })
})

describe('Stat', () => {
  it('renders value and label', () => {
    const w = mount(Stat, { props: { value: '40%', label: 'faster' } })
    expect(w.text()).toContain('40%')
    expect(w.text()).toContain('faster')
  })
})
