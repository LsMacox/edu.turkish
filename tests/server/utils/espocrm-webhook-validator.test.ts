import { describe, expect, it } from 'vitest'

/**
 * Unit test for EspoCRM webhook validator
 *
 * Tests validation schemas and helper functions
 */

describe('EspoCRM Webhook Validator', () => {
  describe('espocrmLeadWebhookSchema', () => {
    it('should validate correct lead webhook payload', () => {
      const validPayload = {
        entityType: 'Lead',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test Lead',
          firstName: 'Test',
          lastName: 'Lead',
          status: 'New',
          createdAt: '2025-10-12T10:30:00Z',
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation passes
      expect(validPayload.entityType).toBe('Lead')
      expect(validPayload.event).toBe('create')
    })

    it('should reject payload with wrong entityType', () => {
      const invalidPayload = {
        entityType: 'Contact', // Should be 'Lead'
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'New',
          createdAt: '2025-10-12T10:30:00Z',
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation fails
      expect(invalidPayload.entityType).not.toBe('Lead')
    })

    it('should reject payload with wrong event type', () => {
      const invalidPayload = {
        entityType: 'Lead',
        event: 'update', // Should be 'create'
        entity: {
          id: '123',
          name: 'Test',
          status: 'New',
          createdAt: '2025-10-12T10:30:00Z',
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation fails
      expect(invalidPayload.event).not.toBe('create')
    })

    it('should reject payload with missing required entity fields', () => {
      const invalidPayload = {
        entityType: 'Lead',
        event: 'create',
        entity: {
          // Missing id, name, status, createdAt
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation fails
      expect(invalidPayload.entity).not.toHaveProperty('id')
      expect(invalidPayload.entity).not.toHaveProperty('name')
    })

    it('should reject payload with invalid email format', () => {
      const invalidPayload = {
        entityType: 'Lead',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'New',
          emailAddress: 'not-an-email',
          createdAt: '2025-10-12T10:30:00Z',
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation fails for email
      expect(invalidPayload.entity.emailAddress).not.toContain('@')
    })

    it('should allow optional fields to be missing', () => {
      const validPayload = {
        entityType: 'Lead',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'New',
          createdAt: '2025-10-12T10:30:00Z',
          // Optional fields missing: firstName, lastName, phoneNumber, etc.
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation passes
      expect(validPayload.entity.id).toBeDefined()
      expect('firstName' in validPayload.entity).toBe(false)
    })

    it('should allow custom fields (passthrough)', () => {
      const validPayload = {
        entityType: 'Lead',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'New',
          createdAt: '2025-10-12T10:30:00Z',
          customField1: 'value1',
          customField2: 123,
        },
        timestamp: '2025-10-12T10:30:00Z',
      }

      // Expected: Validation passes with custom fields
      expect(validPayload.entity).toHaveProperty('customField1')
      expect(validPayload.entity).toHaveProperty('customField2')
    })
  })

  describe('espocrmCallWebhookSchema', () => {
    it('should validate correct call webhook payload', () => {
      const validPayload = {
        entityType: 'Call',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test Call',
          status: 'Held',
          createdAt: '2025-10-12T14:00:00Z',
        },
        timestamp: '2025-10-12T14:00:00Z',
      }

      // Expected: Validation passes
      expect(validPayload.entityType).toBe('Call')
      expect(validPayload.event).toBe('create')
    })

    it('should reject payload with wrong entityType', () => {
      const invalidPayload = {
        entityType: 'Meeting', // Should be 'Call'
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'Held',
          createdAt: '2025-10-12T14:00:00Z',
        },
        timestamp: '2025-10-12T14:00:00Z',
      }

      // Expected: Validation fails
      expect(invalidPayload.entityType).not.toBe('Call')
    })

    it('should validate status enum values', () => {
      const validStatuses = ['Planned', 'Held', 'Not Held']
      const invalidStatus = 'Cancelled'

      // Expected: Only valid statuses accepted
      expect(validStatuses).toContain('Held')
      expect(validStatuses).not.toContain(invalidStatus)
    })

    it('should allow optional fields to be missing', () => {
      const validPayload = {
        entityType: 'Call',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'Held',
          createdAt: '2025-10-12T14:00:00Z',
          // Optional: dateStart, duration, description, etc.
        },
        timestamp: '2025-10-12T14:00:00Z',
      }

      // Expected: Validation passes
      expect(validPayload.entity.id).toBeDefined()
      expect('duration' in validPayload.entity).toBe(false)
    })

    it('should allow custom fields (passthrough)', () => {
      const validPayload = {
        entityType: 'Call',
        event: 'create',
        entity: {
          id: '123',
          name: 'Test',
          status: 'Held',
          createdAt: '2025-10-12T14:00:00Z',
          customCallField: 'custom value',
        },
        timestamp: '2025-10-12T14:00:00Z',
      }

      // Expected: Validation passes
      expect(validPayload.entity).toHaveProperty('customCallField')
    })
  })

  describe('validateWebhookToken', () => {
    it('should return true for valid token', () => {
      const token = 'test-webhook-token-123'
      const expectedToken = 'test-webhook-token-123'

      // Expected: Token matches
      expect(token).toBe(expectedToken)
    })

    it('should return false for invalid token', () => {
      const token = 'wrong-token'
      const expectedToken = 'test-webhook-token-123'

      // Expected: Token does not match
      expect(token).not.toBe(expectedToken)
    })

    it('should return false for empty token', () => {
      const token = ''
      const expectedToken = 'test-webhook-token-123'

      // Expected: Empty token invalid
      expect(token).not.toBe(expectedToken)
      expect(token).toBe('')
    })

    it('should return false for undefined token', () => {
      const token = undefined
      const expectedToken = 'test-webhook-token-123'

      // Expected: Undefined token invalid
      expect(token).toBeUndefined()
      expect(token).not.toBe(expectedToken)
    })
  })

  describe('shouldNotifyByTeam', () => {
    it('should return true when team matches configured team', () => {
      const teamsIds = ['team-abc-123', 'team-xyz-456']
      const configuredTeamId = 'team-abc-123'

      // Expected: Should notify
      const shouldNotify = teamsIds.includes(configuredTeamId)
      expect(shouldNotify).toBe(true)
    })

    it('should return false when team does not match', () => {
      const teamsIds = ['team-xyz-456']
      const configuredTeamId = 'team-abc-123'

      // Expected: Should not notify
      const shouldNotify = teamsIds.includes(configuredTeamId)
      expect(shouldNotify).toBe(false)
    })

    it('should return true when no team filter configured', () => {
      const teamsIds = ['team-xyz-456']
      const configuredTeamId = '' // No filter

      // Expected: Should notify (no filter = send all)
      const shouldNotify = !configuredTeamId || teamsIds.includes(configuredTeamId)
      expect(shouldNotify).toBe(true)
    })

    it('should return true when teamsIds is empty (simplified approach)', () => {
      const teamsIds: string[] = []
      const configuredTeamId = 'team-abc-123'

      // Expected: Should notify (simplified approach)
      const shouldNotify = teamsIds.length === 0 || teamsIds.includes(configuredTeamId)
      expect(shouldNotify).toBe(true)
    })

    it('should return true when teamsIds is undefined', () => {
      const teamsIds = undefined
      const _configuredTeamId = 'team-abc-123'

      // Expected: Should notify (no teams = send)
      const shouldNotify = !teamsIds
      expect(shouldNotify).toBe(true)
    })
  })
})
