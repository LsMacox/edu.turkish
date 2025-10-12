import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, computed } from 'vue'

import ApplicationCTA from '~/components/features/universities/details/ApplicationCTA.vue'

const validateUniversityApplicationMock = vi.fn().mockResolvedValue({ isValid: true, errors: [] })
const resetUniversityApplicationValidationMock = vi.fn()
const setReferralCodeMock = vi.fn()
const sanitizePhoneMock = vi.fn((value: string) => value)

vi.mock('~/composables/validation/useUniversityApplicationValidation', () => ({
  useUniversityApplicationValidation: () => ({
    universityApplicationRules: {},
    validateUniversityApplication: validateUniversityApplicationMock,
    validateField: vi.fn(),
    getFieldError: vi.fn(() => ''),
    isFieldTouched: vi.fn(() => false),
    resetForm: resetUniversityApplicationValidationMock,
    touchField: vi.fn(),
  }),
}))

vi.mock('~/composables/useReferral', () => ({
  useReferral: () => ({
    referralCode: computed(() => 'partner123'),
    setReferralCode: setReferralCodeMock,
  }),
}))

describe('ApplicationCTA', () => {
  const BaseTextFieldStub = defineComponent({
    name: 'BaseTextField',
    props: {
      modelValue: {
        type: String,
        default: '',
      },
    },
    emits: ['update:modelValue'],
    template:
      '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  })

  const BaseSelectStub = defineComponent({
    name: 'BaseSelect',
    props: {
      modelValue: {
        type: String,
        default: '',
      },
    },
    emits: ['update:modelValue'],
    template:
      '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
  })

  const BaseCheckboxStub = defineComponent({
    name: 'BaseCheckbox',
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template:
      '<label><input type="checkbox" :checked="checked" @change="$emit(\'update:checked\', $event.target.checked)" /><slot /></label>',
  })

  let originalUseToast: any
  let originalUseCookie: any
  let originalUseInternationalPhone: any
  let originalFetch: any
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    originalUseToast = (globalThis as any).useToast
    originalUseCookie = (globalThis as any).useCookie
    originalUseInternationalPhone = (globalThis as any).useInternationalPhone
    originalFetch = (globalThis as any).$fetch

    const toastShow = vi.fn()
    ;(globalThis as any).useToast = () => ({ show: toastShow })
    ;(globalThis as any).useCookie = () => ({ value: 'partner123' })
    ;(globalThis as any).useInternationalPhone = () => ({
      sanitizePhone: sanitizePhoneMock,
      onPhoneInput: vi.fn(),
      onPhoneKeydown: vi.fn(),
    })

    fetchMock = vi.fn().mockResolvedValue({ crm: {} })
    ;(globalThis as any).$fetch = fetchMock

    validateUniversityApplicationMock.mockClear()
    resetUniversityApplicationValidationMock.mockClear()
    setReferralCodeMock.mockClear()
    sanitizePhoneMock.mockClear()
  })

  afterEach(() => {
    if (originalUseToast) {
      ;(globalThis as any).useToast = originalUseToast
    } else {
      delete (globalThis as any).useToast
    }

    if (originalUseCookie) {
      ;(globalThis as any).useCookie = originalUseCookie
    } else {
      delete (globalThis as any).useCookie
    }

    if (originalUseInternationalPhone) {
      ;(globalThis as any).useInternationalPhone = originalUseInternationalPhone
    } else {
      delete (globalThis as any).useInternationalPhone
    }

    if (originalFetch) {
      ;(globalThis as any).$fetch = originalFetch
    } else {
      delete (globalThis as any).$fetch
    }

    vi.clearAllMocks()
  })

  it('forwards referral code when submitting the application', async () => {
    const wrapper = mount(ApplicationCTA, {
      props: {
        university: {
          name: 'Test University',
          academicPrograms: [
            {
              name: 'Computer Science',
              level: 'bachelor',
              language: 'en',
              duration: '4 years',
              price: 10000,
            },
          ],
        },
      },
      global: {
        stubs: {
          Icon: true,
          BaseTextField: BaseTextFieldStub,
          BaseSelect: BaseSelectStub,
          BaseCheckbox: BaseCheckboxStub,
        },
        config: {
          globalProperties: {
            $t: (key: string, params?: Record<string, unknown>) =>
              (params?.universityName as string) || key,
          } as any,
        },
      },
    })

    const textFields = wrapper.findAllComponents(BaseTextFieldStub)
    const nameField = textFields[0]
    const emailField = textFields[1]

    if (!nameField || !emailField) {
      throw new Error('Expected name and email text fields to be rendered')
    }

    await nameField.setValue('John Doe')
    await wrapper.find('input[type="tel"]').setValue('+1 555 1234')
    await emailField.setValue('john@example.com')

    const selects = wrapper.findAllComponents(BaseSelectStub)
    const programSelect = selects[0]

    if (!programSelect) {
      throw new Error('Expected academic program select to be rendered')
    }

    await programSelect.setValue('Computer Science')

    await wrapper.find('textarea').setValue('Looking forward to applying')

    const checkbox = wrapper.findComponent(BaseCheckboxStub)
    await checkbox.find('input').setValue(true)

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/applications',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          source: 'university_detail',
          ref: 'partner123',
        }),
      }),
    )

    wrapper.unmount()
  })
})
