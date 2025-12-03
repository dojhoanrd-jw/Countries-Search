import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from './BaseInput.vue'

describe('BaseInput', () => {
  describe('Rendering', () => {
    it('should render input with default props', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('input').exists()).toBe(true)
      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should render with label', () => {
      const wrapper = mount(BaseInput, {
        props: {
          label: 'Email',
        },
      })

      expect(wrapper.find('label').text()).toContain('Email')
    })

    it('should show required asterisk when required', () => {
      const wrapper = mount(BaseInput, {
        props: {
          label: 'Name',
          required: true,
        },
      })

      expect(wrapper.html()).toContain('*')
    })

    it('should render with placeholder', () => {
      const wrapper = mount(BaseInput, {
        props: {
          placeholder: 'Enter your email',
        },
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your email')
    })

    it('should render with hint', () => {
      const wrapper = mount(BaseInput, {
        props: {
          hint: 'This is a helpful hint',
        },
      })

      expect(wrapper.find('.input-hint').text()).toBe('This is a helpful hint')
    })

    it('should render with error', () => {
      const wrapper = mount(BaseInput, {
        props: {
          error: 'This field is required',
        },
      })

      expect(wrapper.find('.input-error').text()).toBe('This field is required')
      expect(wrapper.find('.input-container').classes()).toContain('input-container-error')
    })

    it('should prioritize error over hint', () => {
      const wrapper = mount(BaseInput, {
        props: {
          error: 'Error message',
          hint: 'Hint message',
        },
      })

      expect(wrapper.find('.input-error').exists()).toBe(true)
      expect(wrapper.find('.input-hint').exists()).toBe(false)
    })

    it('should render with icon slots', () => {
      const wrapper = mount(BaseInput, {
        slots: {
          'icon-left': '<span class="left-icon">🔍</span>',
          'icon-right': '<span class="right-icon">✓</span>',
        },
      })

      expect(wrapper.find('.left-icon').exists()).toBe(true)
      expect(wrapper.find('.right-icon').exists()).toBe(true)
    })
  })

  describe('Types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const

    types.forEach((type) => {
      it(`should render ${type} input type`, () => {
        const wrapper = mount(BaseInput, {
          props: { type },
        })

        expect(wrapper.find('input').attributes('type')).toBe(type)
      })
    })

    it('should warn on invalid type', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseInput, {
        props: { type: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseInput] Invalid type')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      it(`should render ${size} size`, () => {
        const wrapper = mount(BaseInput, {
          props: { size },
        })

        expect(wrapper.find('.input-container').classes()).toContain(`input-container-${size}`)
        expect(wrapper.find('input').classes()).toContain(`input-${size}`)
      })
    })

    it('should warn on invalid size', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseInput, {
        props: { size: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseInput] Invalid size')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Variants', () => {
    const variants = ['default', 'filled', 'flushed'] as const

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const wrapper = mount(BaseInput, {
          props: { variant },
        })

        expect(wrapper.find('.input-container').classes()).toContain(`input-container-${variant}`)
      })
    })

    it('should warn on invalid variant', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseInput, {
        props: { variant: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseInput] Invalid variant')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      })

      expect(wrapper.find('input').attributes('disabled')).toBeDefined()
      expect(wrapper.find('.input-container').classes()).toContain('input-container-disabled')
    })

    it('should be readonly when readonly prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { readonly: true },
      })

      expect(wrapper.find('input').attributes('readonly')).toBeDefined()
    })

    it('should be required when required prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: { required: true },
      })

      expect(wrapper.find('input').attributes('required')).toBeDefined()
    })

    it('should apply focused state on focus', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('focus')

      expect(wrapper.find('.input-container').classes()).toContain('input-container-focused')
    })

    it('should remove focused state on blur', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('focus')
      expect(wrapper.find('.input-container').classes()).toContain('input-container-focused')

      await wrapper.find('input').trigger('blur')
      expect(wrapper.find('.input-container').classes()).not.toContain('input-container-focused')
    })
  })

  describe('v-model', () => {
    it('should display modelValue', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test value',
        },
      })

      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('test value')
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })
  })

  describe('Events', () => {
    it('should emit focus event', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('focus')

      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit blur event', async () => {
      const wrapper = mount(BaseInput)

      await wrapper.find('input').trigger('blur')

      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('Clearable', () => {
    it('should not show clear button when clearable is false', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test',
          clearable: false,
        },
      })

      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('should show clear button when clearable and has value', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test',
          clearable: true,
        },
      })

      expect(wrapper.find('button[type="button"]').exists()).toBe(true)
    })

    it('should not show clear button when no value', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          clearable: true,
        },
      })

      expect(wrapper.find('button[type="button"]').exists()).toBe(false)
    })

    it('should clear value when clear button is clicked', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test',
          clearable: true,
        },
      })

      await wrapper.find('button[type="button"]').trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })
  })

  describe('Full Width', () => {
    it('should apply full width class by default', () => {
      const wrapper = mount(BaseInput)

      expect(wrapper.find('.input-wrapper').classes()).toContain('input-full')
    })

    it('should not apply full width class when fullWidth is false', () => {
      const wrapper = mount(BaseInput, {
        props: { fullWidth: false },
      })

      expect(wrapper.find('.input-wrapper').classes()).not.toContain('input-full')
    })
  })
})
