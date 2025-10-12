import { describe, expect, it, beforeEach, vi } from 'vitest'

const readBodyMock = vi.fn()
const assertMethodMock = vi.fn()
const setResponseStatusMock = vi.fn()
const getCookieMock = vi.fn()
const applicationCreateMock = vi.fn()
const createLeadMock = vi.fn()
const queueAddJobMock = vi.fn()

vi.mock('~~/lib/prisma', () => ({
  prisma: {} as any,
}))

vi.mock('~~/server/repositories', () => ({
  ApplicationRepository: vi.fn().mockImplementation(() => ({
    create: applicationCreateMock,
  })),
}))

vi.mock('~~/server/services/crm/CRMFactory', () => ({
  CRMFactory: {
    createFromEnv: vi.fn(() => ({
      providerName: 'bitrix',
      createLead: (...args: any[]) => createLeadMock(...args),
    })),
    getCurrentProvider: vi.fn(() => 'bitrix'),
  },
}))

vi.mock('~~/server/services/queue/RedisQueue', () => ({
  RedisQueue: vi.fn().mockImplementation(() => ({
    addJob: queueAddJobMock,
  })),
}))

vi.mock('h3', () => ({
  getCookie: (...args: any[]) => getCookieMock(...args),
}))
;(globalThis as any).readBody = readBodyMock
;(globalThis as any).assertMethod = assertMethodMock
;(globalThis as any).setResponseStatus = setResponseStatusMock

const baseBody = {
  personal_info: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  },
  preferences: {
    universities: ['Test University'],
  },
  additional_info: 'Interested in programs',
  source: 'home_questionnaire',
  source_description: 'Questionnaire CTA',
  user_preferences: {
    source: 'home_questionnaire',
    description: 'Questionnaire CTA',
  },
  ref: 'PARTNER123',
}

const applicationResponse = {
  id: '1',
  status: 'submitted',
  submitted_at: new Date().toISOString(),
  tracking_code: 'TRACK123',
}

describe('POST /api/v1/applications lead payload', () => {
  beforeEach(() => {
    vi.resetModules()
    readBodyMock.mockReset()
    assertMethodMock.mockReset()
    setResponseStatusMock.mockReset()
    getCookieMock.mockReset()
    applicationCreateMock.mockReset()
    createLeadMock.mockReset()
    queueAddJobMock.mockReset()

    applicationCreateMock.mockResolvedValue(applicationResponse)
    createLeadMock.mockResolvedValue({ success: true, id: 'crm-1' })
    setResponseStatusMock.mockReturnValue(undefined)
  })

  it('keeps CTA source and referral code separated in CRM payload', async () => {
    readBodyMock.mockResolvedValue(baseBody)

    const handler = (await import('~~/server/api/v1/applications/index.post')).default

    const event = { context: { locale: 'en' } } as any
    await handler(event)

    expect(applicationCreateMock).toHaveBeenCalledWith(baseBody)
    expect(createLeadMock).toHaveBeenCalledTimes(1)
    expect(createLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'home_questionnaire',
        sourceDescription: 'Questionnaire CTA',
        referralCode: 'PARTNER123',
      }),
    )
  })

  it('falls back to CTA source when description missing', async () => {
    readBodyMock.mockResolvedValue({
      ...baseBody,
      source_description: undefined,
      ref: undefined,
    })

    const handler = (await import('~~/server/api/v1/applications/index.post')).default

    await handler({ context: {} } as any)

    expect(createLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'home_questionnaire',
        sourceDescription: 'home_questionnaire',
        referralCode: 'DIRECT',
      }),
    )
  })
})
