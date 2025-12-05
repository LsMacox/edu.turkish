import { describe, it, expect, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'

import { ApplicationRepository } from '~~/server/repositories/ApplicationRepository'
import type { ApplicationRequest } from '~~/server/types/api'

describe('tracking code generation', () => {
  it('creates tracking code with EDU prefix via repository', async () => {
    let capturedTrackingCode = ''
    const submittedAt = new Date('2024-01-01T00:00:00.000Z')

    const createMock = vi.fn().mockImplementation((args) => {
      capturedTrackingCode = args.data.trackingCode
      return Promise.resolve({
        id: 42,
        trackingCode: capturedTrackingCode,
        status: 'submitted',
        submittedAt,
      })
    })

    const prismaMock = {
      application: { create: createMock },
    } as unknown as PrismaClient

    const repository = new ApplicationRepository(prismaMock)
    const request: ApplicationRequest = {
      personal_info: {
        first_name: 'John',
        phone: '+1234567890',
      },
    }

    await repository.create(request)

    expect(capturedTrackingCode).toMatch(/^EDU-[0-9A-Z]+-[0-9A-F]{8}$/)
    const parts = capturedTrackingCode.split('-')
    expect(parts).toHaveLength(3)
    expect(parts[0]).toBe('EDU')
  })

  it('generates unique tracking codes', async () => {
    const codes = new Set<string>()
    const submittedAt = new Date()

    const createMock = vi.fn().mockImplementation((args) => {
      codes.add(args.data.trackingCode)
      return Promise.resolve({
        id: codes.size,
        trackingCode: args.data.trackingCode,
        status: 'submitted',
        submittedAt,
      })
    })

    const prismaMock = {
      application: { create: createMock },
    } as unknown as PrismaClient

    const repository = new ApplicationRepository(prismaMock)
    const request: ApplicationRequest = {
      personal_info: {
        first_name: 'Test',
        phone: '+1234567890',
      },
    }

    for (let i = 0; i < 100; i++) {
      await repository.create(request)
    }

    expect(codes.size).toBe(100)
  })
})
