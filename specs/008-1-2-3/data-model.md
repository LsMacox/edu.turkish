# Data Model: Service Pages

## Overview

Data structures for service categories, sub-services, pricing, and currency management. All data is static and stored in i18n JSON files - no database entities required.

## Core Types

### Currency

```typescript
/**
 * Supported currencies for pricing display
 */
type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'

interface CurrencyInfo {
  code: Currency
  symbol: string
  label: string // Localized name (e.g., "Tenge", "Lira")
}

const CURRENCIES: Record<Currency, CurrencyInfo> = {
  KZT: { code: 'KZT', symbol: '₸', label: 'Tenge' },
  TRY: { code: 'TRY', symbol: '₺', label: 'Lira' },
  RUB: { code: 'RUB', symbol: '₽', label: 'Ruble' },
  USD: { code: 'USD', symbol: '$', label: 'Dollar' },
}
```

### Service Category

```typescript
/**
 * Main service categories shown in navigation dropdown
 * Maps to pages in app/pages/services/
 */
type ServiceCategoryId =
  | 'relocation-in-turkey'
  | 'tr-yos-courses'
  | 'sat-courses'
  | 'turkish-english-course'
  | 'document-translations'

interface ServiceCategory {
  id: ServiceCategoryId
  slug: string // URL slug (same as id)
  // Title and subtitle come from i18n: services.{id}.title, services.{id}.subtitle
}
```

### Sub-Service

```typescript
/**
 * Individual service offerings under a category
 * Each has own description, pricing, and can trigger application modal
 */
type SubServiceId =
  // Relocation services
  | 'relocation-visa-support'
  | 'relocation-housing-assistance'
  | 'relocation-bank-account'
  | 'relocation-residence-permit'

  // TR-YÖS Courses
  | 'tr-yos-basic-preparation'
  | 'tr-yos-advanced-preparation'
  | 'tr-yos-individual-tutoring'
  | 'tr-yos-mock-exams'

  // SAT Courses
  | 'sat-basic-preparation'
  | 'sat-advanced-preparation'
  | 'sat-individual-tutoring'

  // Language Courses
  | 'language-turkish-beginner'
  | 'language-turkish-intermediate'
  | 'language-english-beginner'
  | 'language-english-intermediate'

  // Document Translations
  | 'translation-diploma'
  | 'translation-transcript'
  | 'translation-passport'
  | 'translation-other-documents'

interface SubService {
  id: SubServiceId
  categoryId: ServiceCategoryId
  pricing: Record<Currency, string> // String to preserve formatting (e.g., "1,500")
  // Name and description come from i18n: services.{categoryId}.subServices.{id}.name/description
}
```

### Application Context (Modal Enhancement)

```typescript
/**
 * Extended application preferences to include sub-service context
 * Passed to ApplicationModal when user clicks "Apply" on a sub-service
 */
interface ServiceApplicationContext {
  subServiceId: SubServiceId
  subServiceName: string // Localized name for display
  source: 'service-page'
  sourceDescription: string // Full description for CRM (e.g., "TR-YÖS Basic Preparation")
}

// Extends existing ApplicationPreferences type
interface ApplicationPreferences {
  // ... existing fields (userType, language, etc.)
  serviceContext?: ServiceApplicationContext // NEW: optional service context
}
```

## i18n Data Structure

### services.json (per locale)

```json
{
  "services": {
    "relocation-in-turkey": {
      "title": "Relocation in Turkey",
      "subtitle": "Comprehensive support for settling in Turkey",
      "subServices": {
        "relocation-visa-support": {
          "name": "Visa Support",
          "description": "Full assistance with visa application and documentation",
          "pricing": {
            "KZT": "200,000",
            "TRY": "7,000",
            "RUB": "40,000",
            "USD": "400"
          }
        },
        "relocation-housing-assistance": {
          "name": "Housing Assistance",
          "description": "Help finding and securing accommodation",
          "pricing": {
            "KZT": "150,000",
            "TRY": "5,000",
            "RUB": "30,000",
            "USD": "300"
          }
        }
        // ... more sub-services
      }
    },
    "tr-yos-courses": {
      "title": "TR-YÖS Courses",
      "subtitle": "Preparation for Turkish university entrance exams",
      "subServices": {
        "tr-yos-basic-preparation": {
          "name": "Basic TR-YÖS Preparation",
          "description": "Foundational course covering all TR-YÖS topics",
          "pricing": {
            "KZT": "250,000",
            "TRY": "8,500",
            "RUB": "50,000",
            "USD": "500"
          }
        }
        // ... more sub-services
      }
    }
    // ... other categories
  },
  "currency": {
    "selector": {
      "label": "Currency",
      "KZT": "Tenge (₸)",
      "TRY": "Lira (₺)",
      "RUB": "Ruble (₽)",
      "USD": "Dollar ($)"
    }
  },
  "modal": {
    "applying_for": "Applying for",
    "service_context_label": "Selected service"
    // ... existing modal translations
  }
}
```

## State Management

### Currency Store (Pinia)

```typescript
// stores/currency.ts
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>('USD') // Default currency

  const setCurrency = (newCurrency: Currency) => {
    currency.value = newCurrency
    if (import.meta.client) {
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  const initCurrency = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('preferred-currency') as Currency | null
      if (saved && ['KZT', 'TRY', 'RUB', 'USD'].includes(saved)) {
        currency.value = saved
      }
    }
  }

  return {
    currency: readonly(currency),
    setCurrency,
    initCurrency,
  }
})
```

## Validation Rules

### Sub-Service Pricing

- All sub-services MUST have pricing for all 4 currencies
- Prices MUST be non-empty strings
- Format: Numbers with optional thousand separators (e.g., "1,500" or "1500")

### i18n Completeness

- Each service category MUST have title and subtitle in all 4 locales
- Each sub-service MUST have name, description, and pricing in all 4 locales
- Currency labels MUST be translated in all 4 locales

### Application Context

- `subServiceId` MUST match a valid SubServiceId type
- `sourceDescription` MUST be the localized sub-service name
- `source` MUST be 'service-page' for all service applications

## Relationships

```
ServiceCategory (1) -----> (N) SubService
                              |
                              v
                    ApplicationContext
                              |
                              v
                    ApplicationModal
                              |
                              v
                         CRM (via API)
```

## No Database Changes

✅ **No Prisma schema changes required**  
✅ **No migrations needed**  
✅ **No new repositories**  
✅ **No server API endpoints** (all static content)

All data is managed through:

- i18n JSON files (content)
- TypeScript types (structure)
- Pinia store (runtime state)
- localStorage (persistence)

## Type Safety

All types will be defined in `app/types/services.ts` and imported where needed:

```typescript
// app/types/services.ts
export type { Currency, SubServiceId, ServiceCategoryId }
export type { SubService, ServiceCategory, ServiceApplicationContext }
export { CURRENCIES }
```

## Testing Contracts

- i18n structure contract test will validate all required keys exist
- Pricing completeness test will ensure all currencies present
- Type tests will verify TypeScript definitions match i18n structure
