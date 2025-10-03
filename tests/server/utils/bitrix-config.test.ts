import { describe, expect, it, vi } from 'vitest'

import { getBitrixActivityConfig } from '~~/server/utils/bitrix-config'

describe('getBitrixActivityConfig', () => {
  it('parses valid numeric environment variables', () => {
    const logger = { error: vi.fn() }
    const env = {
      BITRIX_ACTIVITY_OWNER_ID: '10',
      BITRIX_ACTIVITY_OWNER_TYPE_ID: '1',
      BITRIX_ACTIVITY_RESPONSIBLE_ID: '25',
    } as NodeJS.ProcessEnv

    const config = getBitrixActivityConfig(env, logger)

    expect(config).toEqual({ ownerId: 10, ownerTypeId: 1, responsibleId: 25 })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('logs errors and omits invalid values', () => {
    const logger = { error: vi.fn() }
    const env = {
      BITRIX_ACTIVITY_OWNER_ID: 'abc',
      BITRIX_ACTIVITY_OWNER_TYPE_ID: '-2',
    } as NodeJS.ProcessEnv

    const config = getBitrixActivityConfig(env, logger)

    expect(config).toEqual({})
    expect(logger.error).toHaveBeenCalledTimes(2)
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('BITRIX_ACTIVITY_OWNER_ID'),
    )
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('BITRIX_ACTIVITY_OWNER_TYPE_ID'),
    )
  })
})
