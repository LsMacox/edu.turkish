import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const locales = ['en', 'ru', 'kk', 'tr']

describe('services.json i18n contract', () => {
  locales.forEach((locale) => {
    describe(`${locale} locale`, () => {
      it('should exist and be valid JSON', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        expect(() => {
          JSON.parse(readFileSync(filePath, 'utf-8'))
        }).not.toThrow()
      })

      it('should have all required service categories', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))

        const requiredCategories = [
          'relocation-in-turkey',
          'tr-yos-courses',
          'sat-courses',
          'turkish-english-course',
          'document-translations',
        ]

        requiredCategories.forEach((categoryId) => {
          expect(data.services).toHaveProperty(categoryId)
          expect(data.services[categoryId]).toHaveProperty('title')
          expect(data.services[categoryId]).toHaveProperty('subtitle')
          expect(data.services[categoryId]).toHaveProperty('subServices')
        })
      })

      it('should have complete pricing for all sub-services', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))

        const currencies = ['KZT', 'TRY', 'RUB', 'USD']

        Object.entries(data.services).forEach(([_categoryId, category]: [string, any]) => {
          if (!category?.subServices) return

          Object.entries(category.subServices).forEach(
            ([_subServiceId, subService]: [string, any]) => {
              currencies.forEach((currency) => {
                expect(subService.pricing).toHaveProperty(currency)
                expect(subService.pricing[currency]).toBeTruthy()
                expect(typeof subService.pricing[currency]).toBe('string')
              })
            },
          )
        })
      })

      it('should have currency selector labels', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))

        expect(data.currency).toHaveProperty('selector')
        expect(data.currency.selector).toHaveProperty('label')
        expect(data.currency.selector).toHaveProperty('KZT')
        expect(data.currency.selector).toHaveProperty('TRY')
        expect(data.currency.selector).toHaveProperty('RUB')
        expect(data.currency.selector).toHaveProperty('USD')
      })

      it('should have new section keys for relocation-in-turkey (Feature 012)', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))
        const service = data.services['relocation-in-turkey']

        // Only validate if sections exist (they will be added incrementally)
        if (service.whoIsThisFor) {
          expect(service.whoIsThisFor).toHaveProperty('title')
          expect(service.whoIsThisFor).toHaveProperty('criteria')
          expect(Array.isArray(service.whoIsThisFor.criteria)).toBe(true)
        }

        if (service.expectedResults) {
          expect(service.expectedResults).toHaveProperty('title')
          expect(service.expectedResults).toHaveProperty('items')
          expect(Array.isArray(service.expectedResults.items)).toBe(true)
        }

        if (service.timelinePlan) {
          expect(service.timelinePlan).toHaveProperty('title')
          expect(service.timelinePlan).toHaveProperty('weeks')
          expect(Array.isArray(service.timelinePlan.weeks)).toBe(true)
        }

        if (service.responsibilityMatrix) {
          expect(service.responsibilityMatrix).toHaveProperty('title')
          expect(service.responsibilityMatrix.weDo).toHaveProperty('title')
          expect(service.responsibilityMatrix.weDo).toHaveProperty('items')
          expect(service.responsibilityMatrix.youDo).toHaveProperty('title')
          expect(service.responsibilityMatrix.youDo).toHaveProperty('items')
        }

        if (service.riskMitigation) {
          expect(service.riskMitigation).toHaveProperty('title')
          expect(service.riskMitigation).toHaveProperty('risks')
          expect(Array.isArray(service.riskMitigation.risks)).toBe(true)
        }

        if (service.faq) {
          expect(service.faq).toHaveProperty('title')
          expect(service.faq).toHaveProperty('items')
          expect(Array.isArray(service.faq.items)).toBe(true)
        }
      })

      it('should have new section keys for course services (Feature 012)', () => {
        const filePath = join(process.cwd(), `i18n/locales/${locale}/services.json`)
        const data = JSON.parse(readFileSync(filePath, 'utf-8'))

        const courseServices = ['tr-yos-courses', 'sat-courses', 'turkish-english-course']

        courseServices.forEach((serviceId) => {
          const service = data.services[serviceId]

          if (service.courseGoal) {
            expect(service.courseGoal).toHaveProperty('title')
            expect(service.courseGoal).toHaveProperty('description')
            expect(service.courseGoal).toHaveProperty('packages')
            expect(Array.isArray(service.courseGoal.packages)).toBe(true)
          }

          if (service.diagnosticTest) {
            expect(service.diagnosticTest).toHaveProperty('title')
            expect(service.diagnosticTest).toHaveProperty('description')
            expect(service.diagnosticTest).toHaveProperty('buttonText')
            expect(service.diagnosticTest).toHaveProperty('buttonUrl')
          }

          if (service.programContent) {
            expect(service.programContent).toHaveProperty('title')
            expect(service.programContent).toHaveProperty('items')
            expect(Array.isArray(service.programContent.items)).toBe(true)
          }

          if (service.formatSchedule) {
            expect(service.formatSchedule).toHaveProperty('title')
          }

          if (service.studentResults) {
            expect(service.studentResults).toHaveProperty('title')
            expect(service.studentResults).toHaveProperty('cases')
            expect(Array.isArray(service.studentResults.cases)).toBe(true)
          }
        })
      })
    })
  })
})
