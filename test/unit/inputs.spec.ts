import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Input from '~/components/ui/Input.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'

describe('Input', () => {
  it('binds v-model and renders label', async () => {
    const w = mount(Input, { props: { modelValue: '', label: 'Name', name: 'name' } })
    expect(w.text()).toContain('Name')
    await w.find('input').setValue('Alice')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['Alice'])
  })

  it('shows error text when error prop is set', () => {
    const w = mount(Input, {
      props: { modelValue: '', label: 'Name', name: 'name', error: 'Required' },
    })
    expect(w.text()).toContain('Required')
  })
})

describe('Textarea', () => {
  it('binds v-model', async () => {
    const w = mount(Textarea, { props: { modelValue: '', label: 'Msg', name: 'msg' } })
    await w.find('textarea').setValue('hello')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })
})

describe('Select', () => {
  it('renders options', () => {
    const w = mount(Select, {
      props: {
        modelValue: '',
        label: 'Industry',
        name: 'industry',
        options: [{ value: 'welding', label: 'Welding' }],
      },
    })
    expect(w.findAll('option').length).toBe(1)
    expect(w.html()).toContain('Welding')
  })
})
