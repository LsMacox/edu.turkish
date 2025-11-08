# i18n Structure Contract

**Feature**: `014-redesign-settlement-service`  
**Type**: Translation Keys & Structure Contract  
**Date**: 2025-01-08

## Overview

This document defines the required i18n structure for the settlement service page redesign across all 4 supported locales (en, ru, kk, tr).

---

## File Location

```
i18n/locales/{locale}/services.json
```

Where `{locale}` is one of: `en`, `ru`, `kk`, `tr`

---

## Required Structure

### Root Path

```
services.relocation-in-turkey.*
```

### Complete Schema

```typescript
{
  "services": {
    "relocation-in-turkey": {
      // Existing keys (keep as-is)
      "title": string,
      "subtitle": string,

      // NEW: Package configurations
      "packages": {
        "standard": {
          "ctaButton": string,              // e.g., "Order"
          "services": string[]              // Array of exactly 9 service descriptions
        },
        "vip": {
          "ctaButton": string,              // e.g., "Order"
          "includes": string,               // e.g., "All Standard services plus:"
          "additionalServices": string[]    // Array of exactly 4 additional services
        }
      },

      // NEW: Benefits section
      "benefits": {
        "title": string,                    // e.g., "Why Choose Us?"
        "content": string                   // Multi-sentence paragraph
      },

      // NEW: Risks section
      "risks": {
        "title": string,                    // e.g., "Common Mistakes to Avoid"
        "content": string                   // Multi-sentence paragraph
      },

      // NEW: FAQ section (replaces old FAQ)
      "faq": {
        "title": string,                    // e.g., "Frequently Asked Questions"
        "items": Array<{
          "question": string,
          "answer": string
        }>                                  // Array of exactly 9 FAQ items
      }

      // REMOVED: The following keys are deleted
      // "whoIsThisFor": {...},
      // "expectedResults": {...},
      // "timelinePlan": {...},
      // "responsibilityMatrix": {...},
      // "riskMitigation": {...}  // Old version
    }
  }
}
```

---

## Validation Rules

### Package Services

**Standard Package** (`services.relocation-in-turkey.packages.standard.services`):

- **Type**: Array of strings
- **Length**: Exactly 9 items
- **Content**: Each item describes one service
- **Max Length**: 150 characters per item

**VIP Package** (`services.relocation-in-turkey.packages.vip.additionalServices`):

- **Type**: Array of strings
- **Length**: Exactly 4 items
- **Content**: Each item describes one additional VIP service
- **Max Length**: 150 characters per item

### Benefits Section

**Title** (`services.relocation-in-turkey.benefits.title`):

- **Type**: String
- **Max Length**: 80 characters
- **Example**: "Why Choose Us?"

**Content** (`services.relocation-in-turkey.benefits.content`):

- **Type**: String
- **Max Length**: 500 characters
- **Format**: Plain text, 2-4 sentences

### Risks Section

**Title** (`services.relocation-in-turkey.risks.title`):

- **Type**: String
- **Max Length**: 80 characters
- **Example**: "Common Mistakes to Avoid"

**Content** (`services.relocation-in-turkey.risks.content`):

- **Type**: String
- **Max Length**: 500 characters
- **Format**: Plain text, 2-4 sentences

### FAQ Section

**Title** (`services.relocation-in-turkey.faq.title`):

- **Type**: String
- **Max Length**: 80 characters
- **Example**: "Frequently Asked Questions"

**Items** (`services.relocation-in-turkey.faq.items`):

- **Type**: Array of objects
- **Length**: Exactly 9 items
- **Structure**: Each item must have:
  - `question` (string, max 200 chars)
  - `answer` (string, max 1000 chars)

---

## English (en) Reference

```json
{
  "services": {
    "relocation-in-turkey": {
      "title": "Settlement in Turkey",
      "subtitle": "Comprehensive support for settling in Turkey - from visa to residence permit",

      "packages": {
        "standard": {
          "ctaButton": "Order",
          "services": [
            "Document translation and legalization",
            "University enrollment guarantee",
            "Accommodation search and contract signing",
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
            "Apartment search and rental contract support",
            "Utilities setup (internet, electricity, water)",
            "Address registration (adres kayit) assistance",
            "Bank account opening with personal accompaniment"
          ]
        }
      },

      "benefits": {
        "title": "Why Choose Us?",
        "content": "We provide modern, trustworthy service. Unlike agencies that rush through processes, we handle everything properly with official documentation and transparent communication. Every step is tracked and you're always informed."
      },

      "risks": {
        "title": "Common Mistakes to Avoid",
        "content": "Many students arrive unprepared and face fines for missed residence permit deadlines, rejected applications due to incorrect documents, or housing contract issues. Edu Turkish has been helping students navigate Turkish bureaucracy since 2018 with zero rejected applications."
      },

      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "How long does the entire settlement process take?",
            "answer": "The full process typically takes 30-45 days from arrival to residence permit submission. We provide a detailed timeline after you submit your documents."
          },
          {
            "question": "Can I pay in installments?",
            "answer": "Yes, we offer payment plans. Standard package can be split into 2 payments, VIP into 3 payments. Contact us for specific terms."
          },
          {
            "question": "Do you work in all Turkish cities?",
            "answer": "We operate in Istanbul, Ankara, Izmir, Antalya, and Bursa. For other cities, we can provide remote consultation and document preparation."
          },
          {
            "question": "Can I order individual services instead of a full package?",
            "answer": "Yes, individual services are available. However, packages offer better value (15-20% discount) and ensure nothing is missed in the settlement process."
          },
          {
            "question": "What are the risks of doing everything myself?",
            "answer": "Common issues include: incorrect document translations rejected by authorities, missed residence permit deadlines resulting in fines (500-1000 TRY), unfavorable rental contracts, and difficulty opening bank accounts without proper guidance."
          },
          {
            "question": "Is accommodation included in the package price?",
            "answer": "No, the package covers search assistance and contract review. You pay rent directly to the landlord. We help you find options within your budget and negotiate fair terms."
          },
          {
            "question": "What documents do I need to prepare before arrival?",
            "answer": "Required: passport (valid 6+ months), university acceptance letter, diploma and transcript, health insurance certificate, and 4 passport photos. We provide a complete checklist with instructions after booking."
          },
          {
            "question": "Do you help with visa applications?",
            "answer": "Standard package includes enrollment documentation for student visa. VIP package includes full visa application support with consulate appointment booking and interview preparation."
          },
          {
            "question": "What happens if my residence permit is rejected?",
            "answer": "In 6 years, we've had zero rejections when clients follow our guidance. If a rejection occurs due to our error, we resubmit at no cost and cover any related fines or legal fees."
          }
        ]
      }
    }
  }
}
```

---

## Russian (ru) Requirements

All keys must be translated to Russian. Package names:

- Standard: "Обустройство по Турции"
- VIP: "Вип обустройство по Турции"

Sample services translation:

- "Document translation and legalization" → "Перевод и легализация документов"
- "University enrollment guarantee" → "Гарантия зачисления в университет"

---

## Kazakh (kk) Requirements

All keys must be translated to Kazakh. Package names:

- Standard: "Түркиядағы орналастыру"
- VIP: "VIP Түркиядағы орналастыру"

Sample services translation:

- "Document translation and legalization" → "Құжаттарды аудару және заңдастыру"
- "University enrollment guarantee" → "Университетке түсу кепілдігі"

---

## Turkish (tr) Requirements

All keys must be translated to Turkish. Package names:

- Standard: "Türkiye'de Yerleşim"
- VIP: "VIP Türkiye'de Yerleşim"

Sample services translation:

- "Document translation and legalization" → "Belge çevirisi ve tasdiki"
- "University enrollment guarantee" → "Üniversite kaydı garantisi"

---

## Migration Checklist

### Keys to Remove

```
services.relocation-in-turkey.whoIsThisFor
services.relocation-in-turkey.expectedResults
services.relocation-in-turkey.timelinePlan
services.relocation-in-turkey.responsibilityMatrix
services.relocation-in-turkey.riskMitigation (old version)
```

### Keys to Add

```
services.relocation-in-turkey.packages.standard.ctaButton
services.relocation-in-turkey.packages.standard.services (array of 9)
services.relocation-in-turkey.packages.vip.ctaButton
services.relocation-in-turkey.packages.vip.includes
services.relocation-in-turkey.packages.vip.additionalServices (array of 4)
services.relocation-in-turkey.benefits.title
services.relocation-in-turkey.benefits.content
services.relocation-in-turkey.risks.title
services.relocation-in-turkey.risks.content
services.relocation-in-turkey.faq.title
services.relocation-in-turkey.faq.items (array of 9)
```

---

## Contract Tests

### Test File

`tests/contract/settlement-i18n.contract.test.ts`

### Required Tests

```typescript
describe('Settlement Service i18n Contract', () => {
  const locales = ['en', 'ru', 'kk', 'tr']

  locales.forEach((locale) => {
    describe(`Locale: ${locale}`, () => {
      it('should have packages.standard.services with exactly 9 items', () => {
        const services =
          messages[locale].services['relocation-in-turkey'].packages.standard.services
        expect(services).toHaveLength(9)
      })

      it('should have packages.vip.additionalServices with exactly 4 items', () => {
        const services =
          messages[locale].services['relocation-in-turkey'].packages.vip.additionalServices
        expect(services).toHaveLength(4)
      })

      it('should have faq.items with exactly 9 questions', () => {
        const items = messages[locale].services['relocation-in-turkey'].faq.items
        expect(items).toHaveLength(9)
      })

      it('should have all required keys', () => {
        const section = messages[locale].services['relocation-in-turkey']
        expect(section.packages.standard.ctaButton).toBeDefined()
        expect(section.packages.vip.includes).toBeDefined()
        expect(section.benefits.title).toBeDefined()
        expect(section.benefits.content).toBeDefined()
        expect(section.risks.title).toBeDefined()
        expect(section.risks.content).toBeDefined()
        expect(section.faq.title).toBeDefined()
      })

      it('should NOT have old section keys', () => {
        const section = messages[locale].services['relocation-in-turkey']
        expect(section.whoIsThisFor).toBeUndefined()
        expect(section.expectedResults).toBeUndefined()
        expect(section.timelinePlan).toBeUndefined()
        expect(section.responsibilityMatrix).toBeUndefined()
      })
    })
  })
})
```

---

## Backward Compatibility

### Breaking Changes

The following i18n keys are **removed** and will break any code referencing them:

- `services.relocation-in-turkey.whoIsThisFor.*`
- `services.relocation-in-turkey.expectedResults.*`
- `services.relocation-in-turkey.timelinePlan.*`
- `services.relocation-in-turkey.responsibilityMatrix.*`
- `services.relocation-in-turkey.riskMitigation.*`

### Migration Plan

1. **Step 1**: Add new keys to all 4 locale files
2. **Step 2**: Update page to use new keys
3. **Step 3**: Remove old keys after confirming new page works
4. **Step 4**: Delete old component files

This ensures rollback is possible until Step 3.

---

## Content Guidelines

### Writing Style

- **Packages**: Action-oriented, benefit-focused ("guarantee", "assistance", "support")
- **Benefits**: Confident, emphasizes quality and trust
- **Risks**: Factual, shows consequences, establishes expertise
- **FAQ**: Direct answers, includes specific details (timelines, costs, procedures)

### Tone

- **Professional** but approachable
- **Helpful** not salesy
- **Factual** with specific examples
- **Reassuring** about potential concerns

### Length Targets

- Package service items: 40-80 characters
- Benefits content: 200-300 characters
- Risks content: 200-350 characters
- FAQ questions: 40-100 characters
- FAQ answers: 100-400 characters
