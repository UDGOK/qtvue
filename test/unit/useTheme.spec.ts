import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '~/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to light', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
  })

  it('toggles to dark and persists', () => {
    const { isDark, toggle } = useTheme()
    toggle()
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respects stored preference', () => {
    localStorage.setItem('theme', 'dark')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })
})
