import { describe, it, expect } from 'vitest'
import {
  workSchema,
  serviceSchema,
  industrySchema,
  blogSchema,
  careerSchema,
} from '~/content.schemas'

describe('content schemas', () => {
  it('validates a valid case study', () => {
    const r = workSchema.safeParse({
      title: 'X',
      summary: 's',
      industry: 'welding',
      services: ['integration'],
      year: 2025,
      image: '/x.jpg',
      featured: true,
    })
    expect(r.success).toBe(true)
  })

  it('rejects a case study missing required fields', () => {
    const r = workSchema.safeParse({ title: 'X' })
    expect(r.success).toBe(false)
  })

  it('validates a service entry', () => {
    expect(
      serviceSchema.safeParse({ title: 'Integration', summary: 's', icon: 'Wrench' }).success,
    ).toBe(true)
  })

  it('validates an industry entry', () => {
    expect(industrySchema.safeParse({ title: 'Welding', summary: 's' }).success).toBe(true)
  })

  it('validates a blog entry', () => {
    expect(
      blogSchema.safeParse({ title: 'T', summary: 's', date: '2026-06-21', author: 'qtvue' })
        .success,
    ).toBe(true)
  })

  it('validates a career entry', () => {
    expect(careerSchema.safeParse({ title: 'Engineer', summary: 's', location: 'Remote' }).success).toBe(
      true,
    )
  })
})
