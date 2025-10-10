import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'

import { ApplicationRepository } from '~~/server/repositories/ApplicationRepository'
import { generateTrackingCode as helperGenerateTrackingCode } from '~~/server/utils/tracking'
import * as trackingUtils from '~~/server/utils/tracking'
import type { ApplicationRequest } from '~~/server/types/api'

describe('tracking code generation', () => {
  it('creates tracking code with EDU prefix via request helper', () => {
    const trackingCode = helperGenerateTrackingCode()

    expect(trackingCode).toMatch(/^EDU-[0-9A-Z]+-[0-9A-F]{8}$/)

    const parts = trackingCode.split('-')
    expect(parts).toHaveLength(3)
    expect(parts[0]).toBe('EDU')
    expect(parts[1]).toMatch(/^[0-9A-Z]+$/)
    expect(parts[2]).toHaveLength(8)
    expect(parts[2]).toMatch(/^[0-9A-F]+$/)
  })

  it('generates sufficiently unique tracking codes', () => {
    const iterations = 1000
    const codes = new Set<string>()

    for (let i = 0; i < iterations; i++) {
      codes.add(helperGenerateTrackingCode())
    }

    expect(codes.size).toBe(iterations)
  })

  it('uses shared tracking generator in repository', async () => {
    const sharedCode = 'EDU-FAKE-CODE'
    const generateSpy = vi.spyOn(trackingUtils, 'generateTrackingCode').mockReturnValue(sharedCode)

    const submittedAt = new Date('2024-01-01T00:00:00.000Z')
    const createMock = vi.fn().mockResolvedValue({
      id: 42,
      trackingCode: sharedCode,
      status: 'submitted',
      personalInfo: {},
      preferences: {},
      additionalInfo: {},
      submittedAt,
    })

    const prismaMock = {
      application: {
        create: createMock,
      },
    } as unknown as PrismaClient

    const repository = new ApplicationRepository(prismaMock)

    const request: ApplicationRequest = {
      personal_info: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      },
      preferences: {},
      additional_info: 'Interested in scholarships',
      source: 'website',
      user_preferences: {},
    }

    try {
      const result = await repository.create(request)

      expect(generateSpy).toHaveBeenCalledTimes(1)
      expect(createMock).toHaveBeenCalledWith({
        data: {
          trackingCode: sharedCode,
          status: 'submitted',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          source: 'website',
          referralCode: null,
          personalInfo: request.personal_info,
          preferences: request.preferences,
          additionalInfo: request.additional_info || {},
        },
      })
      expect(result.tracking_code).toBe(sharedCode)
      expect(result.id).toBe('42')
      expect(result.submitted_at).toBe(submittedAt.toISOString())
    } finally {
      generateSpy.mockRestore()
    }
  })
})
