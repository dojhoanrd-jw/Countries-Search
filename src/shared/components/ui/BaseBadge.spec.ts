import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from './BaseBadge.vue'

describe('BaseBadge', () => {
  describe('Rendering', () => {
    it('should render badge with default props', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Badge',
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.text()).toBe('Badge')
      expect(wrapper.classes()).toContain('badge-primary')
      expect(wrapper.classes()).toContain('badge-md')
    })

    it('should render with custom slot content', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: '99+',
        },
      })

      expect(wrapper.text()).toBe('99+')
    })

    it('should render with icon slots', () => {
      const wrapper = mount(BaseBadge, {
        slots: {
          default: 'Status',
          'icon-left': '<span class="left-icon">✓</span>',
          'icon-right': '<span class="right-icon">→</span>',
        },
      })

      expect(wrapper.find('.left-icon').exists()).toBe(true)
      expect(wrapper.text()).toContain('Status')
      expect(wrapper.find('.right-icon').exists()).toBe(true)
    })
  })

  describe('Variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const wrapper = mount(BaseBadge, {
          props: { variant },
          slots: { default: 'Test' },
        })

        expect(wrapper.classes()).toContain(`badge-${variant}`)
      })
    })

    it('should warn on invalid variant', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseBadge, {
        props: { variant: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseBadge] Invalid variant')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      it(`should render ${size} size`, () => {
        const wrapper = mount(BaseBadge, {
          props: { size },
          slots: { default: 'Test' },
        })

        expect(wrapper.classes()).toContain(`badge-${size}`)
      })
    })

    it('should warn on invalid size', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(BaseBadge, {
        props: { size: 'invalid' as any },
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[BaseBadge] Invalid size')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Modifiers', () => {
    it('should apply rounded class', () => {
      const wrapper = mount(BaseBadge, {
        props: { rounded: true },
        slots: { default: '5' },
      })

      expect(wrapper.classes()).toContain('badge-rounded')
    })

    it('should apply outlined class', () => {
      const wrapper = mount(BaseBadge, {
        props: { outlined: true },
        slots: { default: 'Outlined' },
      })

      expect(wrapper.classes()).toContain('badge-outlined')
    })

    it('should apply dot class', () => {
      const wrapper = mount(BaseBadge, {
        props: { dot: true },
      })

      expect(wrapper.classes()).toContain('badge-dot')
    })

    it('should combine multiple modifiers', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          rounded: true,
          outlined: true,
        },
        slots: { default: 'Combined' },
      })

      expect(wrapper.classes()).toContain('badge-rounded')
      expect(wrapper.classes()).toContain('badge-outlined')
    })
  })

  describe('Outlined Variants', () => {
    const variants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const

    variants.forEach((variant) => {
      it(`should render outlined ${variant} variant`, () => {
        const wrapper = mount(BaseBadge, {
          props: {
            variant,
            outlined: true,
          },
          slots: { default: 'Test' },
        })

        expect(wrapper.classes()).toContain(`badge-${variant}`)
        expect(wrapper.classes()).toContain('badge-outlined')
      })
    })
  })

  describe('Use Cases', () => {
    it('should render as notification badge', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          variant: 'danger',
          size: 'sm',
          rounded: true,
        },
        slots: { default: '3' },
      })

      expect(wrapper.classes()).toContain('badge-danger')
      expect(wrapper.classes()).toContain('badge-sm')
      expect(wrapper.classes()).toContain('badge-rounded')
      expect(wrapper.text()).toBe('3')
    })

    it('should render as status badge', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          variant: 'success',
          size: 'md',
        },
        slots: { default: 'Active' },
      })

      expect(wrapper.classes()).toContain('badge-success')
      expect(wrapper.text()).toBe('Active')
    })

    it('should render as dot indicator', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          variant: 'warning',
          dot: true,
        },
      })

      expect(wrapper.classes()).toContain('badge-warning')
      expect(wrapper.classes()).toContain('badge-dot')
    })

    it('should render as outlined tag', () => {
      const wrapper = mount(BaseBadge, {
        props: {
          variant: 'info',
          outlined: true,
          size: 'lg',
        },
        slots: { default: 'Featured' },
      })

      expect(wrapper.classes()).toContain('badge-info')
      expect(wrapper.classes()).toContain('badge-outlined')
      expect(wrapper.classes()).toContain('badge-lg')
    })
  })
})
