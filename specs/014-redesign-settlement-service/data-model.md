# Data Model: Redesign Settlement Service Page

**Feature**: `014-redesign-settlement-service`  
**Phase**: 1 (Design)  
**Date**: 2025-01-08

## Overview

This document describes the data model changes for the settlement service page redesign. The key architectural decision is to **minimize database usage** and store most content in i18n translation files, keeping only basic package metadata (name, price, slug) in the database.

---

## Schema Changes

### No Database Schema Changes Required

The existing Prisma schema already supports the required functionality:

```prisma
model SubService {
  id                Int
  serviceCategoryId Int
  slug              String
  type              SubServiceType  // 'offering' or 'calculator'
  priceUsd          Decimal
  deliveryTimeDays  Int?
  order             Int
  isActive          Boolean
  translations      SubServiceTranslation[]
}

model SubServiceTranslation {
  id           Int
  subServiceId Int
  locale       String
  name         String
  description  String?
}
```

**Rationale**: The `SubService` model already has all necessary fields:
- `slug` - Package identifier ('relocation-standard', 'relocation-vip')
- `priceUsd` - Package price ($1500, $2000)
- `translations.name` - Package display name (localized)
- `translations.description` - Package description (localized, optional)

Service lists, benefits, risks, and FAQ will live in i18n files, not the database.

---

## Data Storage Strategy

### Database (Prisma + PostgreSQL)

**Purpose**: Store only basic package metadata that changes infrequently

**Data Stored**:
- Package slug (relocation-standard, relocation-vip)
- Package price in USD (1500, 2000)
- Package name (translated: "Обустройство по Турции", "Settlement in Turkey", etc.)
- Package description (optional short summary)

**Sample Data**:

```typescript
// Standard Package
{
  id: 101,
  serviceCategoryId: 1,  // relocation-in-turkey category
  slug: 'relocation-standard',
  type: 'offering',
  priceUsd: 1500.00,
  deliveryTimeDays: null,
  order: 1,
  isActive: true,
  translations: [
    { locale: 'en', name: 'Settlement in Turkey', description: 'Standard package' },
    { locale: 'ru', name: 'Обустройство по Турции', description: 'Стандартный пакет' },
    { locale: 'kk', name: 'Түркиядағы орналастыру', description: 'Стандартты пакет' },
    { locale: 'tr', name: 'Türkiye\'de Yerleşim', description: 'Standart paket' }
  ]
}

// VIP Package
{
  id: 102,
  serviceCategoryId: 1,
  slug: 'relocation-vip',
  type: 'offering',
  priceUsd: 2000.00,
  deliveryTimeDays: null,
  order: 2,
  isActive: true,
  translations: [
    { locale: 'en', name: 'VIP Settlement in Turkey', description: 'Premium package' },
    { locale: 'ru', name: 'Вип обустройство по Турции', description: 'Премиум пакет' },
    { locale: 'kk', name: 'VIP Түркиядағы орналастыру', description: 'Премиум пакет' },
    { locale: 'tr', name: 'VIP Türkiye\'de Yerleşim', description: 'Premium paket' }
  ]
}
```

### i18n Files (JSON)

**Purpose**: Store all detailed content that changes frequently and needs easy editing

**Location**: `i18n/locales/{locale}/services.json`

**Data Stored**:
- Package service lists (9 for Standard, 4 additional for VIP)
- Benefits section content
- Risks section content
- FAQ items (9 questions with answers)

**Structure**:

```typescript
{
  "services": {
    "relocation-in-turkey": {
      // Keep existing
      "title": "Relocation in Turkey",
      "subtitle": "Comprehensive support for settling in Turkey",
      
      // NEW: Package details
      "packages": {
        "standard": {
          "ctaButton": "Order",
          "services": [
            "Document translation and legalization",
            "University enrollment guarantee",
            "Accommodation search and contract",
            "Airport transfer and city orientation",
            "Final registration with the university",
            "Student pass issuance assistance",
            "Residence permit application support",
            "Denklik belgesi (diploma recognition)",
            "Tax number (vergi numarası) registration"
          ]
        },
        "vip": {
          "ctaButton": "Order",
          "includes": "All Standard services plus:",
          "additionalServices": [
            "Apartment search and rental support",
            "Utilities setup (internet, electricity, water)",
            "Address registration (adres kayit)",
            "Bank account opening assistance"
          ]
        }
      },
      
      // NEW: Benefits section
      "benefits": {
        "title": "Why Choose Us?",
        "content": "We provide modern, trustworthy service. Unlike agencies that rush through processes, we handle everything properly with official documentation and transparent communication."
      },
      
      // NEW: Risks section
      "risks": {
        "title": "Common Mistakes to Avoid",
        "content": "Many students arrive unprepared and face fines, rejected applications, or housing issues. Edu Turkish has been helping students navigate Turkish bureaucracy since 2018 with zero rejected applications."
      },
      
      // NEW: FAQ (9 questions)
      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "How long does the entire settlement process take?",
            "answer": "The full process typically takes 30-45 days from arrival to residence permit submission. We provide a detailed timeline after you submit your documents."
          },
          {
            "question": "Can I pay in installments?",
            "answer": "Yes, we offer payment plans. Standard package can be split into 2 payments, VIP into 3 payments. Contact us for details."
          },
          {
            "question": "Do you work in all Turkish cities?",
            "answer": "We operate in Istanbul, Ankara, Izmir, Antalya, and Bursa. For other cities, we can provide remote consultation and document preparation."
          },
          {
            "question": "Can I order individual services instead of a full package?",
            "answer": "Yes, you can order services separately. However, packages offer better value and ensure nothing is missed in the process."
          },
          {
            "question": "What are the risks of doing everything myself?",
            "answer": "Common issues include: incorrect document translations, missed deadlines for residence permits (resulting in fines), unfavorable rental contracts, and difficulty opening bank accounts without proper guidance."
          },
          {
            "question": "Is accommodation included in the package price?",
            "answer": "No, the package covers the search and contract assistance. You pay rent directly to the landlord. We help you find options within your budget."
          },
          {
            "question": "What documents do I need to prepare before arrival?",
            "answer": "You'll need: passport (valid 6+ months), university acceptance letter, diploma and transcript, health insurance, and passport photos. We provide a complete checklist after booking."
          },
          {
            "question": "Do you help with visa applications?",
            "answer": "Standard package includes enrollment documentation for visa. VIP package includes full visa application support with consulate appointment booking."
          },
          {
            "question": "What happens if my residence permit is rejected?",
            "answer": "In 6 years, we've had zero rejections. If a rejection occurs due to our error, we resubmit at no cost and cover any related fines."
          }
        ]
      }
      
      // REMOVED: whoIsThisFor, expectedResults, timelinePlan, 
      //          responsibilityMatrix, riskMitigation (old)
    }
  }
}
```

---

## Data Flow

### On Page Load

```
1. Browser requests /services/relocation-in-turkey
2. Nuxt SSR fetches from API: /api/v1/services/relocation-in-turkey?locale=ru
3. ServiceRepository queries database:
   - ServiceCategory (id, slug, isActive)
   - SubService (slug, priceUsd, order) WHERE type='offering'
   - SubServiceTranslation (name, description) WHERE locale='ru' OR locale='en'
4. API returns: { category: ServiceCategoryDetail }
5. Page renders:
   - Hero: category.title, category.subtitle
   - Packages: Loop through category.subServices
     - For each package: fetch services from i18n using package.slug
     - Display name from database, services from i18n
   - Benefits: Fetch from i18n (benefits.*)
   - Risks: Fetch from i18n (risks.*)
   - FAQ: Fetch from i18n (faq.items[])
```

### On CTA Click

```
1. User clicks "Order" button on package card
2. Component emits: { subServiceId: 'relocation-standard', name: 'Settlement in Turkey' }
3. Page handler calls: applicationModalStore.openModal({ serviceContext: {...} })
4. Modal opens with pre-filled service context
5. User submits application → POST /api/v1/applications
6. CRM receives lead with package context
```

---

## Type Definitions

### API Types

**Location**: `server/types/api/services.ts`

```typescript
// Existing types - NO CHANGES NEEDED

export interface ServiceCategoryDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: Record<string, unknown> | null
  subServices: SubServiceDetail[]
  calculator?: {
    standardUsd: number
    expressUsd?: number
    rushUsd?: number
  }
  urgencyMultipliers?: {
    express: number
    rush: number
  }
}

export interface SubServiceDetail {
  id: number
  slug: string
  name: string
  description: string
  priceUsd: number
  deliveryTimeDays: number | null
  order: number
}
```

### Component Props Types

**Location**: `app/types/services.ts`

```typescript
// Existing type - NO CHANGES

export type SubServiceId = 
  | 'relocation-visa-support'
  | 'relocation-housing-assistance'
  | 'relocation-bank-account'
  | 'relocation-residence-permit'
  // Add new package slugs
  | 'relocation-standard'
  | 'relocation-vip'
  // ... other services

// NEW: Package service item
export interface PackageService {
  text: string  // Service description from i18n
}

// NEW: Package card props
export interface PackageCardProps {
  packageId: SubServiceId  // 'relocation-standard' or 'relocation-vip'
  name: string            // From database translation
  price: number           // From database priceUsd
  services: PackageService[]  // From i18n
  isVip?: boolean         // For visual distinction
  isMobile?: boolean      // For accordion behavior
}
```

---

## i18n Contract

### Required Keys Per Locale

Each of the 4 locales (en, ru, kk, tr) must have:

```
services.relocation-in-turkey.packages.standard.ctaButton         [string]
services.relocation-in-turkey.packages.standard.services          [array of 9 strings]
services.relocation-in-turkey.packages.vip.ctaButton              [string]
services.relocation-in-turkey.packages.vip.includes               [string]
services.relocation-in-turkey.packages.vip.additionalServices     [array of 4 strings]
services.relocation-in-turkey.benefits.title                      [string]
services.relocation-in-turkey.benefits.content                    [string]
services.relocation-in-turkey.risks.title                         [string]
services.relocation-in-turkey.risks.content                       [string]
services.relocation-in-turkey.faq.title                           [string]
services.relocation-in-turkey.faq.items                           [array of 9 objects]
services.relocation-in-turkey.faq.items[N].question               [string]
services.relocation-in-turkey.faq.items[N].answer                 [string]
```

**Validation**: Contract tests will verify all keys exist in all locales.

---

## Migration Plan

### Phase 1: Add New Data

1. **Database**: Insert two SubService records (standard, vip) via Prisma seed or manual SQL
2. **i18n**: Add new keys to all 4 locale files

### Phase 2: Update Code

1. **Page**: Refactor to use new components and i18n structure
2. **Components**: Create PackageCard, BenefitsSection, RisksSection

### Phase 3: Remove Old Data

1. **i18n**: Remove old section keys (whoIsThisFor, expectedResults, etc.)
2. **Database**: Mark old sub-services as inactive (isActive=false) if no longer needed

### Rollback Strategy

If issues arise, revert i18n changes and restore old page code. Database records remain unchanged as fallback.

---

## Performance Considerations

### Database Queries

- **Before**: 1 query fetching category + 4-5 sub-services + translations
- **After**: 1 query fetching category + 2 sub-services (packages) + translations
- **Impact**: ~50% reduction in rows returned, minimal performance gain

### i18n Bundle Size

- **Before**: ~400 lines for relocation-in-turkey section
- **After**: ~380 lines (net reduction due to simpler structure)
- **Impact**: Negligible, i18n loaded on demand

### Rendering Performance

- **Before**: 7 section components, each with complex layouts
- **After**: 2 package cards + 2 simple text sections + 1 FAQ
- **Impact**: Expected 20-30% faster render time

---

## Validation & Constraints

### Data Integrity Rules

1. **Package Prices**: Must be positive decimals (enforced by Prisma `Decimal` type)
2. **Package Slugs**: Must be unique within category (enforced by compound unique constraint)
3. **Translations**: All 4 locales must have entries (enforced by application logic)
4. **Service Lists**: Standard must have exactly 9 items, VIP 4 additional items (enforced by contract tests)

### Business Rules

1. Standard package = $1500 (fixed price, no discounts in initial version)
2. VIP package = $2000 (fixed price)
3. VIP package includes ALL Standard services (validated in i18n structure)
4. FAQ must have exactly 9 questions (per spec requirement)

---

## Future Considerations

### Potential Enhancements

1. **Dynamic Pricing**: Move prices to CMS for easier updates without deployments
2. **Package Comparison**: Add side-by-side comparison table
3. **Add-ons**: Support individual service add-ons to base packages
4. **Testimonials**: Add customer reviews to benefits section

### Scalability

- Current structure supports up to 10 packages per category (database indexes optimized for this)
- i18n structure scales linearly with number of packages
- No performance concerns up to 100 packages per category
