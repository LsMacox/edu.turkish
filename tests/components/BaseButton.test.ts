import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/shared/BaseButton.vue'

const IconStub = {
  name: 'Icon',
  template: '<span data-testid="icon">{{ name }}</span>',
  props: ['name'],
}

const mountBaseButton = (options: Parameters<typeof mount>[1] = {}) => {
  return mount(BaseButton, {
    ...options,
    global: {
      ...(options.global ?? {}),
      stubs: {
        Icon: IconStub,
        ...(options.global?.stubs ?? {}),
      },
    },
  })
}

describe('BaseButton', () => {
  it('renders as button by default', () => {
    const wrapper = mountBaseButton({
      slots: { default: 'Click me' },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.text()).toBe('Click me')
  })

  it('renders as anchor when href is provided', () => {
    const wrapper = mountBaseButton({
      props: { href: 'https://example.com' },
      slots: { default: 'Link' },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('shows loading spinner when loading', () => {
    const wrapper = mountBaseButton({
      props: { loading: true },
      slots: { default: 'Loading' },
    })

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('shows icon when provided', () => {
    const wrapper = mountBaseButton({
      props: { icon: 'mdi:heart' },
      slots: { default: 'Like' },
    })

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('renders icon-only button when no default slot is provided', () => {
    const wrapper = mountBaseButton({
      props: {
        icon: 'mdi:heart',
        ariaLabel: 'Favorite',
      },
    })

    const icon = wrapper.find('[data-testid="icon"]')
    expect(icon.exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Favorite')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mountBaseButton({
      slots: { default: 'Click me' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mountBaseButton({
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mountBaseButton({
      props: { loading: true },
      slots: { default: 'Loading' },
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('handles keyboard activation', async () => {
    const wrapper = mountBaseButton({
      slots: { default: 'Button' },
    })

    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toBeTruthy()

    await wrapper.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })

  it('applies accessibility attributes correctly', () => {
    const wrapper = mountBaseButton({
      props: {
        ariaLabel: 'Custom label',
        ariaPressed: true,
      },
      slots: { default: 'Button' },
    })

    expect(wrapper.attributes('aria-label')).toBe('Custom label')
    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('shows correct button type', () => {
    const wrapper = mountBaseButton({
      props: { type: 'submit' },
      slots: { default: 'Submit' },
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('exposes focus and blur helpers', () => {
    const wrapper = mountBaseButton({
      props: { icon: 'mdi:heart' },
    })

    const focusSpy = vi.spyOn(wrapper.element, 'focus')
    const blurSpy = vi.spyOn(wrapper.element, 'blur')

    wrapper.vm.focus()
    expect(focusSpy).toHaveBeenCalled()

    wrapper.vm.blur()
    expect(blurSpy).toHaveBeenCalled()
  })
})
