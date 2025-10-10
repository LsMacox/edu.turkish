import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { computed } from 'vue'

const validateApplicationModal = vi.fn()
const resetFormMock = vi.fn()
const sanitizePhoneMock = vi.fn((value: string) => value)

vi.mock('~/composables/useReferral', () => ({
  useReferral: () => ({
    referralCode: computed(() => 'PARTNER123'),
  }),
}))

vi.mock('~/composables/validation/useApplicationModalValidation', () => ({
  useApplicationModalValidation: () => ({
    applicationModalRules: {
      name: [],
      phone: [],
      email: [],
      message: [],
      agreement: [],
    },
    validateApplicationModal,
    validateField: vi.fn(),
    getFieldError: vi.fn().mockReturnValue(null),
    isFieldTouched: vi.fn().mockReturnValue(false),
    resetForm: resetFormMock,
  }),
}))

describe('ApplicationModal submission payload', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let toastShowMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true })
    toastShowMock = vi.fn()
    ;(globalThis as any).$fetch = fetchMock
    ;(globalThis as any).useToast = () => ({ show: toastShowMock })
    ;(globalThis as any).useInternationalPhone = () => ({
      sanitizePhone: sanitizePhoneMock,
      onPhoneInput: vi.fn(),
      onPhoneKeydown: vi.fn(),
    })
    ;(globalThis as any).$t = (key: string) => key
    if (typeof globalThis.eval === 'function') {
      globalThis.eval('$t = globalThis.$t')
    }
    validateApplicationModal.mockResolvedValue({ isValid: true, errors: [] })
    sanitizePhoneMock.mockImplementation((value: string) => `sanitized:${value}`)
  })

  afterEach(() => {
    delete (globalThis as any).$fetch
    delete (globalThis as any).useToast
    delete (globalThis as any).useInternationalPhone
    if (typeof globalThis.eval === 'function') {
      globalThis.eval('$t = undefined')
    }
    delete (globalThis as any).$t
    vi.clearAllMocks()
  })

  it('sends CTA source and description while keeping referral code in ref', async () => {
    const { default: ApplicationModal } = await import('~/components/modals/ApplicationModal.vue')

    const wrapper = mount(ApplicationModal, {
      props: {
        isOpen: true,
        userPreferences: {
          source: 'home_questionnaire',
          description: 'Questionnaire CTA',
          universityName: 'Test University',
        },
      },
      global: {
        stubs: {
          BaseTextField: {
            template: '<input />',
          },
          BaseCheckbox: {
            template: '<input type="checkbox" />',
          },
        },
      },
    })

    const vm = wrapper.vm as any
    const formState = vm.form?.value ?? vm.form
    expect(formState).toBeDefined()
    Object.assign(formState, {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      message: 'Hello',
      agreement: true,
    })

    await vm.submitForm()
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const request = fetchMock.mock.calls[0]?.[1]?.body
    expect(request).toBeDefined()
    expect(request.source).toBe('home_questionnaire')
    expect(request.source_description).toBe('Questionnaire CTA')
    expect(request.ref).toBe('PARTNER123')
    expect(request.personal_info.phone).toBe('sanitized:+1234567890')
  })
})
