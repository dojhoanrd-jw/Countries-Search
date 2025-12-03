import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('should render button with default props', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Click me',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.text()).toBe('Click me')
      expect(wrapper.classes()).toContain('btn-primary')
      expect(wrapper.classes()).toContain('btn-md')
    })

    it('should render with custom slot content', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      })

      expect(wrapper.html()).toContain('Custom Content')
    })

    it('should render with icon slots', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Button',
          'icon-left': '<span class="left-icon">←</span>',
          'icon-right': '<span class="right-icon">→</span>',
        },
      })

      expect(wrapper.find('.left-icon').exists()).toBe(true)
      expect(wrapper.find('.right-icon').exists()).toBe(true)
    })
  })

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'] as const

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const wrapper = mount(BaseButton, {
          props: { variant },
        })

        expect(wrapper.classes()).toContain(`btn-${variant}`)
      })
    })

    it('should warn on invalid variant', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseButton, {
        props: { variant: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseButton] Invalid variant')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const

    sizes.forEach((size) => {
      it(`should render ${size} size`, () => {
        const wrapper = mount(BaseButton, {
          props: { size },
        })

        expect(wrapper.classes()).toContain(`btn-${size}`)
      })
    })

    it('should warn on invalid size', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseButton, {
        props: { size: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseButton] Invalid size')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Types', () => {
    it('should render button type by default', () => {
      const wrapper = mount(BaseButton)

      expect(wrapper.attributes('type')).toBe('button')
    })

    it('should render submit type', () => {
      const wrapper = mount(BaseButton, {
        props: { type: 'submit' },
      })

      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('should render reset type', () => {
      const wrapper = mount(BaseButton, {
        props: { type: 'reset' },
      })

      expect(wrapper.attributes('type')).toBe('reset')
    })

    it('should warn on invalid type', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseButton, {
        props: { type: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseButton] Invalid type')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('btn-disabled')
    })

    it('should show loading state', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: {
          default: 'Submit',
        },
      })

      expect(wrapper.classes()).toContain('btn-loading')
      expect(wrapper.find('.btn-loader').exists()).toBe(true)
    })

    it('should show loading text when loading', () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
          loadingText: 'Saving...',
        },
      })

      expect(wrapper.text()).toBe('Saving...')
    })

    it('should hide icons when loading', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
        slots: {
          'icon-left': '<span class="icon">Icon</span>',
        },
      })

      expect(wrapper.find('.icon').exists()).toBe(false)
    })
  })

  describe('Modifiers', () => {
    it('should apply full width class', () => {
      const wrapper = mount(BaseButton, {
        props: { fullWidth: true },
      })

      expect(wrapper.classes()).toContain('btn-full')
    })

    it('should apply rounded class', () => {
      const wrapper = mount(BaseButton, {
        props: { rounded: true },
      })

      expect(wrapper.classes()).toContain('btn-rounded')
    })
  })

  describe('Events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')?.length).toBe(1)
    })

    it('should not emit click when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should not emit click when loading', async () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('should pass event to click handler', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')

      const emittedEvent = wrapper.emitted('click')?.[0]?.[0]
      expect(emittedEvent).toBeInstanceOf(MouseEvent)
    })
  })
})
