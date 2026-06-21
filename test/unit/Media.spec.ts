import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Media from '~/components/ui/Media.vue'

describe('Media', () => {
  it('renders an img with the given src and alt', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: 'robot' } })
    expect(w.find('img').attributes('src')).toBe('/x.jpg')
    expect(w.find('img').attributes('alt')).toBe('robot')
  })

  it('applies aspect ratio style when ratio provided', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: 'x', ratio: '16/9' } })
    expect(w.attributes('style') ?? '').toContain('aspect-ratio')
  })

  it('uses empty alt when decorative', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: '', decorative: true } })
    expect(w.find('img').attributes('alt')).toBe('')
  })
})
