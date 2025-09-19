import { describe, it, expect, beforeEach } from 'vitest'
import { useFormValidation } from '~/composables/useFormValidation'

describe('useFormValidation', () => {
  let validation: ReturnType<typeof useFormValidation>

  beforeEach(() => {
    validation = useFormValidation()
  })

  describe('field validation', () => {
    it('should validate required fields correctly', async () => {
      const rules = [validation.createRules.required('Name is required')]
      
      // Test empty value
      let result = await validation.validateField('name', '', rules)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Name is required')
      
      // Test valid value
      result = await validation.validateField('name', 'John Doe', rules)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate email format correctly', async () => {
      const rules = [validation.createRules.email('Invalid email format')]
      
      // Test invalid email
      let result = await validation.validateField('email', 'invalid-email', rules)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
      
      // Test valid email
      result = await validation.validateField('email', 'user@example.com', rules)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate phone numbers correctly', async () => {
      const rules = [validation.createRules.phone('Invalid phone number')]
      
      // Test invalid phone
      let result = await validation.validateField('phone', '123', rules)
      expect(result.isValid).toBe(false)
      
      // Test valid Turkish phone
      result = await validation.validateField('phone', '+905551234567', rules)
      expect(result.isValid).toBe(true)
    })

    it('should validate minimum length correctly', async () => {
      const rules = [validation.createRules.minLength(3, 'Minimum 3 characters')]
      
      // Test too short
      let result = await validation.validateField('text', 'ab', rules)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Minimum 3 characters')
      
      // Test valid length
      result = await validation.validateField('text', 'abc', rules)
      expect(result.isValid).toBe(true)
    })

    it('should validate multiple rules', async () => {
      const rules = [
        validation.createRules.required('Required'),
        validation.createRules.minLength(5, 'Min 5 chars'),
        validation.createRules.email('Invalid email')
      ]
      
      // Test multiple validation failures
      let result = await validation.validateField('email', 'ab', rules)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // minLength + email format
      
      // Test valid value
      result = await validation.validateField('email', 'user@example.com', rules)
      expect(result.isValid).toBe(true)
    })
  })

  describe('form state management', () => {
    it('should track form validity correctly', async () => {
      expect(validation.isFormValid.value).toBe(true) // Initially valid
      
      // Add invalid field
      await validation.validateField('name', '', [validation.createRules.required()])
      expect(validation.isFormValid.value).toBe(false)
      
      // Fix the field
      await validation.validateField('name', 'John', [validation.createRules.required()])
      expect(validation.isFormValid.value).toBe(true)
    })

    it('should clear field validation', async () => {
      // Add error
      await validation.validateField('name', '', [validation.createRules.required()])
      expect(validation.getFieldError('name')).toBeTruthy()
      
      // Clear validation
      validation.clearFieldValidation('name')
      expect(validation.getFieldError('name')).toBeUndefined()
    })

    it('should reset form completely', async () => {
      // Add multiple fields with errors
      await validation.validateField('name', '', [validation.createRules.required()])
      await validation.validateField('email', 'invalid', [validation.createRules.email()])
      
      expect(validation.hasErrors.value).toBe(true)
      
      // Reset form
      validation.resetForm()
      expect(validation.hasErrors.value).toBe(false)
      expect(validation.isFormValid.value).toBe(true)
    })
  })

  describe('field state tracking', () => {
    it('should track touched fields', () => {
      expect(validation.isFieldTouched('name')).toBe(false)
      
      validation.touchField('name')
      expect(validation.isFieldTouched('name')).toBe(true)
      
      validation.untouchField('name')
      expect(validation.isFieldTouched('name')).toBe(false)
    })

    it('should provide form values', async () => {
      await validation.validateField('name', 'John', [])
      await validation.validateField('email', 'john@example.com', [])
      
      const values = validation.getFormValues()
      expect(values).toEqual({
        name: 'John',
        email: 'john@example.com'
      })
    })
  })
})

describe('useContactFormValidation', () => {
  it('should provide pre-configured rules for contact forms', async () => {
    const mod = await import('~/composables/useFormValidation')
    const contactValidation = mod.useContactFormValidation()
    
    expect(contactValidation.contactFormRules.name).toHaveLength(4) // required, minLength, maxLength, pattern
    expect(contactValidation.contactFormRules.phone).toHaveLength(2) // required, phone
    expect(contactValidation.contactFormRules.email).toHaveLength(2) // required, email
  })
})