import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
// @ts-ignore - Vue component type import in test
import type BaseTextField from '~/components/shared/BaseTextField.vue'

// @ts-ignore - Nuxt auto-imports

describe('BaseTextField', () => {
  const defaultProps = {
    modelValue: '',
    'onUpdate:modelValue': vi.fn(),
  }

  it('renders correctly with minimal props', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: defaultProps,
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('displays label when provided', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        label: 'Email Address',
      },
    })

    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Email Address')
  })

  it('shows required indicator when required', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        label: 'Name',
        required: true,
      },
    })

    const requiredIndicator = wrapper.find('span[aria-label="required"]')
    expect(requiredIndicator.exists()).toBe(true)
    expect(requiredIndicator.text()).toBe('*')
  })

  it('displays error message correctly', () => {
    const errorMessage = 'This field is required'
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        error: errorMessage,
      },
    })

    const errorElement = wrapper.find('[role="alert"]')
    expect(errorElement.exists()).toBe(true)
    expect(errorElement.text()).toContain(errorMessage)
  })

  it('displays helper text when provided', () => {
    const helperText = 'Enter your email address'
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        helperText,
      },
    })

    expect(wrapper.text()).toContain(helperText)
  })

  it('shows icon when provided', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        icon: 'mdi:email',
      },
    })

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('shows clear button when clearable and has value', async () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        modelValue: 'some text',
        clearable: true,
      },
    })

    const clearButton = wrapper.find('button')
    expect(clearButton.exists()).toBe(true)
  })

  it('emits update:modelValue when input changes', async () => {
    const mockUpdate = vi.fn()
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        'onUpdate:modelValue': mockUpdate,
      },
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(mockUpdate).toHaveBeenCalledWith('new value')
  })

  it('emits clear event when clear button is clicked', async () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        modelValue: 'some text',
        clearable: true,
      },
    })

    const clearButton = wrapper.find('button')
    await clearButton.trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('applies correct accessibility attributes', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        label: 'Email',
        required: true,
        error: 'Invalid email',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBeTruthy()
  })

  it('handles different input types correctly', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        type: 'email',
      },
    })

    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('applies size classes correctly', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        size: 'lg',
      },
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('py-5')
  })

  it('handles focus and blur events', async () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: defaultProps,
    })

    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('handles disabled state correctly', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        disabled: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.classes()).toContain('opacity-50')
  })

  it('handles readonly state correctly', () => {
    const wrapper = mount({} as typeof BaseTextField, {
      props: {
        ...defaultProps,
        readonly: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
  })
})
