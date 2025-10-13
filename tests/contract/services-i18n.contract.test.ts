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

          Object.entries(category.subServices).forEach(([_subServiceId, subService]: [string, any]) => {
            currencies.forEach((currency) => {
              expect(subService.pricing).toHaveProperty(currency)
              expect(subService.pricing[currency]).toBeTruthy()
              expect(typeof subService.pricing[currency]).toBe('string')
            })
          })
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
    })
  })
})
