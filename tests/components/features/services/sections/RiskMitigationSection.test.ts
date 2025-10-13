import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RiskMitigationSection from '~/components/features/services/sections/RiskMitigationSection.vue'

const messages = {
  services: {
    'test-service': {
      riskMitigation: {
        title: 'Risks & How We Address Them',
        risks: [
          {
            risk: 'Visa rejection',
            mitigation: 'We pre-check all documents and provide sample letters',
          },
          {
            risk: 'Rental contract errors',
            mitigation: 'All contracts reviewed by our legal team',
          },
          {
            risk: 'Bank account limits',
            mitigation: 'We work with multiple banks',
          },
        ],
      },
    },
  },
}

const mockUseI18n = () => ({
  t: (key: string) => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  },
  tm: (key: string) => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || []
  },
  locale: { value: 'en' },
})

describe('RiskMitigationSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', mockUseI18n)
  })

  const createWrapper = (props: any = {}) => {
    return mount(RiskMitigationSection, {
      props: {
        keyPrefix: 'services.test-service.riskMitigation',
        ...props,
      },
      global: {
        stubs: {
          BaseSectionHeader: {
            template: '<div><h2>{{ title }}</h2></div>',
            props: ['title'],
          },
        },
      },
    })
  }

  it('renders title from i18n', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Risks & How We Address Them')
  })

  it('renders all risk items', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Visa rejection')
    expect(wrapper.text()).toContain('Rental contract errors')
    expect(wrapper.text()).toContain('Bank account limits')
  })

  it('renders all mitigation strategies', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('We pre-check all documents and provide sample letters')
    expect(wrapper.text()).toContain('All contracts reviewed by our legal team')
    expect(wrapper.text()).toContain('We work with multiple banks')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Risk Management' })
    expect(wrapper.text()).toContain('Risk Management')
  })

  it('pairs risks with their mitigations', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()
    const visaIndex = text.indexOf('Visa rejection')
    const mitigationIndex = text.indexOf('We pre-check all documents')
    expect(visaIndex).toBeLessThan(mitigationIndex)
  })
})
