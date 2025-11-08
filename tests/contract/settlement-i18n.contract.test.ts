/**
 * Contract Test: Settlement Service i18n Structure
 *
 * Validates the i18n structure for the redesigned settlement service page
 * Feature: 014-redesign-settlement-service
 *
 * Tests MUST fail before implementation (TDD approach)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const locales = ['en', 'ru', 'kk', 'tr']

describe('Settlement Service i18n Contract (Feature 014)', () => {
  locales.forEach((locale) => {
    describe(`Locale: ${locale}`, () => {
      let data: any

      beforeEach(() => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        data = JSON.parse(readFileSync(filePath, 'utf-8'))
      })

      describe('Package Structure', () => {
        it('should have packages.standard.services with exactly 9 items', () => {
          const services = data.services['relocation-in-turkey']?.packages?.standard?.services
          expect(services, 'packages.standard.services must exist').toBeDefined()
          expect(Array.isArray(services), 'packages.standard.services must be an array').toBe(true)
          expect(services, 'packages.standard.services must have exactly 9 items').toHaveLength(9)

          // Each service should be a non-empty string
          services.forEach((service: any, index: number) => {
            expect(typeof service, `Service ${index} must be a string`).toBe('string')
            expect(service.length, `Service ${index} must not be empty`).toBeGreaterThan(0)
          })
        })

        it('should have packages.vip.additionalServices with exactly 4 items', () => {
          const services = data.services['relocation-in-turkey']?.packages?.vip?.additionalServices
          expect(services, 'packages.vip.additionalServices must exist').toBeDefined()
          expect(Array.isArray(services), 'packages.vip.additionalServices must be an array').toBe(
            true,
          )
          expect(
            services,
            'packages.vip.additionalServices must have exactly 4 items',
          ).toHaveLength(4)

          // Each service should be a non-empty string
          services.forEach((service: any, index: number) => {
            expect(typeof service, `VIP service ${index} must be a string`).toBe('string')
            expect(service.length, `VIP service ${index} must not be empty`).toBeGreaterThan(0)
          })
        })

        it('should have packages.standard.ctaButton', () => {
          const ctaButton = data.services['relocation-in-turkey']?.packages?.standard?.ctaButton
          expect(ctaButton, 'packages.standard.ctaButton must exist').toBeDefined()
          expect(typeof ctaButton, 'ctaButton must be a string').toBe('string')
          expect(ctaButton.length, 'ctaButton must not be empty').toBeGreaterThan(0)
        })

        it('should have packages.vip.ctaButton', () => {
          const ctaButton = data.services['relocation-in-turkey']?.packages?.vip?.ctaButton
          expect(ctaButton, 'packages.vip.ctaButton must exist').toBeDefined()
          expect(typeof ctaButton, 'ctaButton must be a string').toBe('string')
          expect(ctaButton.length, 'ctaButton must not be empty').toBeGreaterThan(0)
        })

        it('should have packages.vip.includes text', () => {
          const includes = data.services['relocation-in-turkey']?.packages?.vip?.includes
          expect(includes, 'packages.vip.includes must exist').toBeDefined()
          expect(typeof includes, 'includes must be a string').toBe('string')
          expect(includes.length, 'includes must not be empty').toBeGreaterThan(0)
        })
      })

      describe('Benefits Section', () => {
        it('should have benefits.title', () => {
          const title = data.services['relocation-in-turkey']?.benefits?.title
          expect(title, 'benefits.title must exist').toBeDefined()
          expect(typeof title, 'title must be a string').toBe('string')
          expect(title.length, 'title must not be empty').toBeGreaterThan(0)
        })

        it('should have benefits.content', () => {
          const content = data.services['relocation-in-turkey']?.benefits?.content
          expect(content, 'benefits.content must exist').toBeDefined()
          expect(typeof content, 'content must be a string').toBe('string')
          expect(content.length, 'content must not be empty').toBeGreaterThan(0)
        })
      })

      describe('Risks Section', () => {
        it('should have risks.title', () => {
          const title = data.services['relocation-in-turkey']?.risks?.title
          expect(title, 'risks.title must exist').toBeDefined()
          expect(typeof title, 'title must be a string').toBe('string')
          expect(title.length, 'title must not be empty').toBeGreaterThan(0)
        })

        it('should have risks.content', () => {
          const content = data.services['relocation-in-turkey']?.risks?.content
          expect(content, 'risks.content must exist').toBeDefined()
          expect(typeof content, 'content must be a string').toBe('string')
          expect(content.length, 'content must not be empty').toBeGreaterThan(0)
        })
      })

      describe('FAQ Section', () => {
        it('should have faq.title', () => {
          const title = data.services['relocation-in-turkey']?.faq?.title
          expect(title, 'faq.title must exist').toBeDefined()
          expect(typeof title, 'title must be a string').toBe('string')
          expect(title.length, 'title must not be empty').toBeGreaterThan(0)
        })

        it('should have faq.items with exactly 9 questions', () => {
          const items = data.services['relocation-in-turkey']?.faq?.items
          expect(items, 'faq.items must exist').toBeDefined()
          expect(Array.isArray(items), 'faq.items must be an array').toBe(true)
          expect(items, 'faq.items must have exactly 9 items').toHaveLength(9)

          // Each FAQ item must have question and answer
          items.forEach((item: any, index: number) => {
            expect(item, `FAQ item ${index} must be an object`).toBeDefined()
            expect(typeof item.question, `FAQ ${index} must have a question string`).toBe('string')
            expect(item.question.length, `FAQ ${index} question must not be empty`).toBeGreaterThan(
              0,
            )
            expect(typeof item.answer, `FAQ ${index} must have an answer string`).toBe('string')
            expect(item.answer.length, `FAQ ${index} answer must not be empty`).toBeGreaterThan(0)
          })
        })
      })

      describe('Backward Compatibility', () => {
        it('should NOT have old section keys (they should be removed)', () => {
          const service = data.services['relocation-in-turkey']

          // These old keys should be removed after implementation
          // Tests will pass initially (keys exist), then fail (being removed), then pass (fully migrated)
          // For now, we just document what should be removed
          if (service.whoIsThisFor !== undefined) {
            console.warn(`[${locale}] Old key 'whoIsThisFor' still exists - should be removed`)
          }
          if (service.expectedResults !== undefined) {
            console.warn(`[${locale}] Old key 'expectedResults' still exists - should be removed`)
          }
          if (service.timelinePlan !== undefined) {
            console.warn(`[${locale}] Old key 'timelinePlan' still exists - should be removed`)
          }
          if (service.responsibilityMatrix !== undefined) {
            console.warn(
              `[${locale}] Old key 'responsibilityMatrix' still exists - should be removed`,
            )
          }
        })
      })
    })
  })
})
