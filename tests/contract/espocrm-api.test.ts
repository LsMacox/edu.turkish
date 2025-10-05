import { describe, it, expect, beforeAll } from 'vitest'

/**
 * Contract Tests for EspoCRM API
 * 
 * These tests verify the EspoCRM REST API contract compliance.
 * Tests MUST FAIL until EspoCRM is deployed and configured.
 */

describe('EspoCRM API Contract', () => {
  const ESPOCRM_URL = process.env.ESPOCRM_URL || 'http://espocrm:8080'
  const API_KEY = process.env.ESPOCRM_API_KEY || 'test-api-key'
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
  }

  beforeAll(() => {
    // Verify environment is configured
    if (!API_KEY || API_KEY === 'test-api-key') {
      console.warn('⚠️  ESPOCRM_API_KEY not configured, tests will fail')
    }
  })

  describe('POST /Lead - Create Lead', () => {
    it('should create lead with valid data', async () => {
      const leadData = {
        firstName: 'Ivan',
        lastName: 'Petrov',
        phoneNumber: '+77001234567',
        emailAddress: 'ivan@example.com',
        referralCodeC: 'PARTNER123',
        source: 'university_detail',
        userTypeC: 'student',
        languageC: 'turkish',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadData),
      })

      expect(response.status).toBe(200)
      const result = await response.json()
      expect(result.id).toBeDefined()
      expect(result.firstName).toBe('Ivan')
      expect(result.referralCodeC).toBe('PARTNER123')
    })

    it('should create lead with optional custom fields', async () => {
      const leadData = {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '+77009999999',
        emailAddress: 'test@example.com',
        referralCodeC: 'TEST123',
        source: 'test',
        fieldOfStudyC: 'Engineering',
        universityC: 'Bogazici University',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadData),
      })

      expect(response.status).toBe(200)
      const result = await response.json()
      expect(result.fieldOfStudyC).toBe('Engineering')
      expect(result.universityC).toBe('Bogazici University')
    })

    it('should reject invalid email format', async () => {
      const invalidLead = {
        firstName: 'Invalid',
        lastName: 'Email',
        phoneNumber: '+77001111111',
        emailAddress: 'not-an-email',
        referralCodeC: 'TEST',
        source: 'test',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify(invalidLead),
      })

      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toBeDefined()
    })

    it('should reject missing required fields', async () => {
      const incompleteLead = {
        firstName: 'Incomplete',
        // Missing lastName, phone, email, referralCode, source
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify(incompleteLead),
      })

      expect(response.status).toBe(400)
    })

    it('should reject invalid API key', async () => {
      const leadData = {
        firstName: 'Test',
        lastName: 'Auth',
        phoneNumber: '+77002222222',
        emailAddress: 'auth@example.com',
        referralCodeC: 'AUTH',
        source: 'test',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'invalid-key',
        },
        body: JSON.stringify(leadData),
      })

      expect(response.status).toBe(401)
    })
  })

  describe('PUT /Lead/{id} - Update Lead', () => {
    let createdLeadId: string

    beforeAll(async () => {
      // Create a lead to update
      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          firstName: 'ToUpdate',
          lastName: 'User',
          phoneNumber: '+77003333333',
          emailAddress: 'update@example.com',
          referralCodeC: 'UPDATE',
          source: 'test',
        }),
      })
      const result = await response.json()
      createdLeadId = result.id
    })

    it('should update existing lead', async () => {
      const updateData = {
        firstName: 'Updated',
        description: 'Lead was updated via API',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead/${createdLeadId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData),
      })

      expect(response.status).toBe(200)
      const result = await response.json()
      expect(result.firstName).toBe('Updated')
      expect(result.description).toContain('updated')
    })

    it('should return 404 for non-existent lead', async () => {
      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead/non-existent-id`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ firstName: 'Test' }),
      })

      expect(response.status).toBe(404)
    })
  })

  describe('POST /Activity - Create Activity', () => {
    it('should create activity with valid data', async () => {
      const activityData = {
        name: 'Messenger click: telegram',
        type: 'Call',
        status: 'Held',
        description: 'User clicked telegram link. Referral: PARTNER123, UTM: instagram',
        dateStart: new Date().toISOString(),
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Activity`, {
        method: 'POST',
        headers,
        body: JSON.stringify(activityData),
      })

      expect(response.status).toBe(200)
      const result = await response.json()
      expect(result.id).toBeDefined()
      expect(result.name).toContain('telegram')
      expect(result.type).toBe('Call')
    })

    it('should create activity with minimal data', async () => {
      const activityData = {
        name: 'Messenger click: whatsapp',
        type: 'Call',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Activity`, {
        method: 'POST',
        headers,
        body: JSON.stringify(activityData),
      })

      expect(response.status).toBe(200)
    })

    it('should reject missing required fields', async () => {
      const invalidActivity = {
        description: 'Missing name and type',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Activity`, {
        method: 'POST',
        headers,
        body: JSON.stringify(invalidActivity),
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Field Mapping Verification', () => {
    it('should correctly map custom fields', async () => {
      const leadData = {
        firstName: 'FieldMap',
        lastName: 'Test',
        phoneNumber: '+77004444444',
        emailAddress: 'fieldmap@example.com',
        referralCodeC: 'FIELD123',
        source: 'test',
        userTypeC: 'parent',
        languageC: 'english',
        fieldOfStudyC: 'Medicine',
        universityC: 'Istanbul University',
      }

      const response = await fetch(`${ESPOCRM_URL}/api/v1/Lead`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadData),
      })

      expect(response.status).toBe(200)
      const result = await response.json()
      
      // Verify all custom fields are mapped correctly
      expect(result.referralCodeC).toBe('FIELD123')
      expect(result.userTypeC).toBe('parent')
      expect(result.languageC).toBe('english')
      expect(result.fieldOfStudyC).toBe('Medicine')
      expect(result.universityC).toBe('Istanbul University')
    })
  })
})
