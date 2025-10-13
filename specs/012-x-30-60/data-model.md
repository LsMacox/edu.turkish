# Data Model: Enhanced Service Page Content Blocks

**Phase**: 1 (Design)  
**Date**: 2025-01-13  
**Status**: Complete

## Overview

This document defines the data structures for service page content blocks. All data is stored in i18n JSON files (`i18n/locales/{locale}/services.json`) and consumed by Vue components via the `useI18n()` composable.

## Data Storage

**Location**: `i18n/locales/{en,ru,kk,tr}/services.json`

**Access Pattern**:

```typescript
const { t, tm } = useI18n()

// Single value
const title = t('services.relocation-in-turkey.whoIsThisFor.title')

// Array
const raw = tm('services.relocation-in-turkey.whoIsThisFor.criteria') as unknown[]
const criteria = raw.map(
  (_, index) => t(`services.relocation-in-turkey.whoIsThisFor.criteria.${index}`) as string,
)

// Object array
const raw = tm('services.tr-yos-courses.programContent.items') as unknown[]
const items = raw.map((_, index) => ({
  title: t(`services.tr-yos-courses.programContent.items.${index}.title`) as string,
  description: t(`services.tr-yos-courses.programContent.items.${index}.description`) as string,
  icon: t(`services.tr-yos-courses.programContent.items.${index}.icon`) as string,
}))
```

## i18n Schema by Service

### 1. Relocation to Turkey

```json
{
  "services": {
    "relocation-in-turkey": {
      "title": "Relocation to Turkey",
      "subtitle": "Full support for moving to Turkey - from visa to residence permit",

      "whoIsThisFor": {
        "title": "Who Is This For?",
        "criteria": [
          "You've been accepted and are moving within X weeks",
          "You need visa, housing, bank, residence permit 'turnkey'",
          "You don't want to run around government offices and get fined"
        ]
      },

      "expectedResults": {
        "title": "Expected Results",
        "items": [
          "Visa obtained, legal entry",
          "Rental contract in your name",
          "Turkish bank account opened, card in hand",
          "Residence permit package submitted, status tracking",
          "Curator support for {duration} days after arrival"
        ],
        "durationOptions": ["30", "60"]
      },

      "timelinePlan": {
        "title": "30-Day Plan",
        "weeks": [
          { "number": 1, "activities": "Documents and visa center appointment" },
          { "number": 2, "activities": "Arrival, SIM, tax number" },
          { "number": 3, "activities": "Housing + bank" },
          { "number": 4, "activities": "Residence permit package, submission" }
        ]
      },

      "responsibilityMatrix": {
        "title": "We Do / You Do",
        "weDo": {
          "title": "We Do",
          "items": [
            "Prepare all documents",
            "Book visa appointment",
            "Find housing options",
            "Accompany to bank",
            "Submit residence permit application",
            "Track application status"
          ]
        },
        "youDo": {
          "title": "You Do",
          "items": [
            "Provide required documents",
            "Attend visa appointment",
            "Choose housing from options",
            "Sign rental contract",
            "Provide bank documents",
            "Attend biometric appointment"
          ]
        }
      },

      "riskMitigation": {
        "title": "Risks & How We Address Them",
        "risks": [
          {
            "risk": "Visa rejection",
            "mitigation": "We pre-check all documents, provide sample letters, and prepare you for interview questions"
          },
          {
            "risk": "Rental contract errors",
            "mitigation": "All contracts reviewed by our legal team before signing"
          },
          {
            "risk": "Bank account limits",
            "mitigation": "We work with multiple banks and know their requirements for international students"
          },
          {
            "risk": "Residence permit delays",
            "mitigation": "We submit applications early and track status daily via government portal"
          }
        ]
      },

      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "Can I do it without income statement?",
            "answer": "Yes, for students we can use acceptance letter and scholarship confirmation as proof of financial support."
          },
          {
            "question": "What if my address changes?",
            "answer": "You must notify immigration within 20 days. We'll help you update your registration."
          },
          {
            "question": "Can I bring my family?",
            "answer": "Yes, family members can apply for dependent residence permits. We handle the entire process."
          }
        ]
      },

      "subServices": {
        "relocation-visa-support": {
          /* existing */
        },
        "relocation-housing-assistance": {
          /* existing */
        },
        "relocation-bank-account": {
          /* existing */
        },
        "relocation-residence-permit": {
          /* existing */
        }
      }
    }
  }
}
```

### 2. TR-YÖS Courses

```json
{
  "services": {
    "tr-yos-courses": {
      "title": "TR-YÖS Courses",
      "subtitle": "Prepare for TR-YÖS exam and get into your dream Turkish university",

      "courseGoal": {
        "title": "Course Goal",
        "description": "We'll prepare you for TR-YÖS to a score sufficient for admission to your faculty.",
        "packages": [
          { "name": "Basic", "targetScore": "50-60" },
          { "name": "Standard", "targetScore": "60-70" },
          { "name": "Premium", "targetScore": "70+" }
        ]
      },

      "diagnosticTest": {
        "title": "20-Minute Diagnostic",
        "description": "Take a quick test to get a personalized package recommendation.",
        "buttonText": "Take Test",
        "buttonUrl": "/diagnostic/tr-yos"
      },

      "programContent": {
        "title": "What's Inside the Program",
        "items": [
          {
            "title": "Theory",
            "description": "Mathematics, logic, geometry",
            "icon": "mdi:book-open"
          },
          {
            "title": "Practice",
            "description": "12 full mock exams",
            "icon": "mdi:pencil"
          },
          {
            "title": "Error Analysis",
            "description": "Personalized feedback on every test",
            "icon": "mdi:chart-line"
          },
          {
            "title": "Materials",
            "description": "Task bank with 500+ problems and notes",
            "icon": "mdi:folder"
          }
        ]
      },

      "formatSchedule": {
        "title": "Format & Schedule",
        "format": "Online or in-person, group (up to 10) or individual",
        "duration": "8 weeks (24 lessons)",
        "homework": "Yes, with detailed review",
        "support": "Between sessions via Telegram chat"
      },

      "studentResults": {
        "title": "Student Results",
        "cases": [
          {
            "before": 42,
            "after": 68,
            "duration": "8 weeks",
            "proof": "/images/tr-yos-case-1.png"
          },
          {
            "before": 55,
            "after": 72,
            "duration": "8 weeks",
            "proof": "/images/tr-yos-case-2.png"
          }
        ]
      },

      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "How do I register for the TR-YÖS exam?",
            "answer": "Registration opens in February on university websites. We'll guide you through the process."
          },
          {
            "question": "Can I retake the exam?",
            "answer": "Yes, you can take TR-YÖS at multiple universities. Each has its own exam."
          },
          {
            "question": "Can I reschedule lessons?",
            "answer": "Yes, with 24 hours notice. We'll find a makeup time that works for you."
          }
        ]
      },

      "subServices": {
        "tr-yos-basic": {
          /* existing */
        },
        "tr-yos-standard": {
          /* existing */
        },
        "tr-yos-premium": {
          /* existing */
        }
      }
    }
  }
}
```

### 3. SAT Courses

```json
{
  "services": {
    "sat-courses": {
      "title": "SAT Courses",
      "subtitle": "Prepare for Digital SAT and get into top international universities",

      "courseGoal": {
        "title": "Target Results",
        "description": "Focused on Digital SAT preparation.",
        "packages": [
          { "name": "Foundation", "targetScore": "1200+" },
          { "name": "Advanced", "targetScore": "1350+" },
          { "name": "Elite", "targetScore": "1450+" }
        ]
      },

      "diagnosticTest": {
        "title": "Start with Diagnostic",
        "description": "Get your individual study plan based on current level.",
        "buttonText": "SAT Diagnostic",
        "buttonUrl": "/diagnostic/sat"
      },

      "programContent": {
        "title": "Program Content",
        "items": [
          {
            "title": "Math",
            "description": "Algebra, geometry, data analysis, advanced math",
            "icon": "mdi:calculator"
          },
          {
            "title": "Reading & Writing",
            "description": "Comprehension, grammar, rhetoric, vocabulary",
            "icon": "mdi:text"
          },
          {
            "title": "Mock Tests",
            "description": "Weekly full-length tests with timing",
            "icon": "mdi:clock"
          },
          {
            "title": "Strategies",
            "description": "Time management, section-specific tactics",
            "icon": "mdi:strategy"
          },
          {
            "title": "Progress Tracking",
            "description": "Homework trackers and performance analytics",
            "icon": "mdi:chart-box"
          }
        ]
      },

      "formatSchedule": {
        "title": "Format",
        "enrollmentSchedule": "New cohorts start every month",
        "duration": "12 weeks (36 lessons)",
        "recordings": "Access to all recorded sessions",
        "taskBank": "Full task bank with 1000+ problems"
      },

      "studentResults": {
        "title": "Case Studies",
        "cases": [
          {
            "score": 1420,
            "proof": "/images/sat-report-1.png",
            "admission": "MIT"
          },
          {
            "score": 1380,
            "proof": "/images/sat-report-2.png",
            "admission": "Stanford"
          }
        ]
      },

      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "How many times can I take the SAT?",
            "answer": "You can take the SAT as many times as you want. Most students take it 2-3 times."
          },
          {
            "question": "Can I change my test date?",
            "answer": "Yes, College Board allows date changes for a fee. We'll help you navigate the process."
          },
          {
            "question": "Do I need TOEFL/IELTS too?",
            "answer": "It depends on the university. Some accept high SAT Reading & Writing scores instead."
          }
        ]
      },

      "subServices": {
        "sat-foundation": {
          /* existing */
        },
        "sat-advanced": {
          /* existing */
        },
        "sat-elite": {
          /* existing */
        }
      }
    }
  }
}
```

### 4. Turkish/English Language Courses

```json
{
  "services": {
    "turkish-english-course": {
      "title": "Turkish & English Courses",
      "subtitle": "Learn Turkish or English with native speakers and certified teachers",

      "levelProgression": {
        "title": "Your Level Progression",
        "levels": [
          {
            "from": "A1",
            "to": "A2",
            "outcome": "Basic conversations, daily tasks, simple texts"
          },
          {
            "from": "B1",
            "to": "B2",
            "outcome": "Work meetings, academic discussions, complex texts"
          },
          {
            "from": "C1",
            "to": "C2",
            "outcome": "Native-like fluency, professional writing, nuanced expression"
          }
        ]
      },

      "diagnosticTest": {
        "title": "10-Minute Level Test",
        "description": "Determine your starting level and get a personalized learning plan.",
        "buttonText": "Determine Level",
        "buttonUrl": "/diagnostic/language"
      },

      "formatSchedule": {
        "title": "Learning Format",
        "groupSize": "Up to 8 students per group",
        "individual": "Individual lessons available",
        "conversationClubs": "Weekly conversation clubs included",
        "schedule": "Flexible schedule, morning/evening options",
        "platform": "Zoom + learning portal with materials",
        "certificate": "Certificate of completion issued"
      },

      "teachers": {
        "title": "Methodology & Teachers",
        "methodology": "We use a communicative approach with real-world scenarios. Every lesson includes speaking practice, grammar in context, and cultural insights.",
        "profiles": [
          {
            "name": "Ayşe Yılmaz",
            "photo": "/images/teacher-ayse.jpg",
            "achievements": "Native Turkish speaker, 10+ years teaching experience, TÖMER certified"
          },
          {
            "name": "John Smith",
            "photo": "/images/teacher-john.jpg",
            "achievements": "Native English speaker, CELTA certified, 8 years in Turkey"
          },
          {
            "name": "Mehmet Demir",
            "photo": "/images/teacher-mehmet.jpg",
            "achievements": "Bilingual Turkish-English, MA in Linguistics, exam prep specialist"
          }
        ]
      },

      "expectedResults": {
        "title": "Results in 12 Weeks",
        "duration": "12",
        "skills": [
          "Open a bank account in Turkish",
          "Pass a university interview",
          "Read news articles and understand main ideas",
          "Write formal emails and applications",
          "Navigate daily life without translation apps"
        ]
      },

      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          {
            "question": "What if I miss a class?",
            "answer": "All lessons are recorded. You can watch the recording and we'll schedule a makeup if needed."
          },
          {
            "question": "Can I freeze my course?",
            "answer": "Yes, you can freeze for up to 2 weeks. Just let us know in advance."
          },
          {
            "question": "What's your refund policy?",
            "answer": "Full refund within first 2 lessons. After that, prorated refund for unused lessons."
          }
        ]
      },

      "subServices": {
        "turkish-a1-a2": {
          /* existing */
        },
        "turkish-b1-b2": {
          /* existing */
        },
        "english-a1-a2": {
          /* existing */
        },
        "english-b1-b2": {
          /* existing */
        }
      }
    }
  }
}
```

### 5. Document Translations

```json
{
  "services": {
    "document-translations": {
      "title": "Document Translations",
      "subtitle": "Professional translation of documents for Turkish universities",

      "priceCalculator": {
        "title": "Price Calculator",
        "documentTypes": [
          "Diploma",
          "Transcript",
          "Passport",
          "Birth Certificate",
          "Marriage Certificate",
          "Other"
        ],
        "languages": [
          "English → Turkish",
          "Russian → Turkish",
          "Kazakh → Turkish",
          "Turkish → English"
        ],
        "urgency": ["Standard (5 business days)", "Express (2 business days)", "Rush (24 hours)"],
        "basePrices": {
          "standard": {
            "KZT": "10000",
            "TRY": "350",
            "RUB": "2000",
            "USD": "20"
          },
          "express": {
            "KZT": "15000",
            "TRY": "525",
            "RUB": "3000",
            "USD": "30"
          },
          "rush": {
            "KZT": "20000",
            "TRY": "700",
            "RUB": "4000",
            "USD": "40"
          }
        }
      },

      "universityRequirements": {
        "title": "What Universities Accept",
        "formats": [
          "Notarized translation (most common)",
          "Apostille + notarized translation (for some countries)",
          "Consular legalization (for non-Hague countries)"
        ],
        "acceptedBy": "All major Turkish universities including Istanbul University, Boğaziçi, METU, Sabancı, Koç"
      },

      "sampleDocuments": {
        "title": "Sample Pages",
        "samples": [
          {
            "type": "Diploma Translation",
            "image": "/images/sample-diploma.jpg"
          },
          {
            "type": "Transcript Translation",
            "image": "/images/sample-transcript.jpg"
          },
          {
            "type": "Passport Translation",
            "image": "/images/sample-passport.jpg"
          }
        ]
      },

      "subServices": {
        "translation-standard": {
          /* existing */
        },
        "translation-express": {
          /* existing */
        },
        "translation-notarized": {
          /* existing */
        },
        "translation-apostille": {
          /* existing */
        }
      }
    }
  }
}
```

## TypeScript Types

All types are defined in `specs/012-x-30-60/contracts/component-props.ts`.

**Key Types**:

- `TimelineWeek`: `{ number: number; activities: string }`
- `ResponsibilityItem`: `{ title: string; items: string[] }`
- `RiskItem`: `{ risk: string; mitigation: string }`
- `PackageTier`: `{ name: string; targetScore: string }`
- `ProgramItem`: `{ title: string; description: string; icon: string }`
- `CaseStudy`: `{ before?: number; after?: number; score?: number; duration?: string; proof?: string; admission?: string }`
- `LevelProgression`: `{ from: string; to: string; outcome: string }`
- `TeacherProfile`: `{ name: string; photo: string; achievements: string }`
- `FAQItem`: `{ question: string; answer: string }`
- `SampleDocument`: `{ type: string; image: string }`

## Data Validation

**Contract Tests** (`tests/contract/services-i18n.contract.test.ts`):

1. Verify all required keys exist in all 4 locales
2. Verify array lengths match across locales
3. Verify object structures match across locales
4. Verify pricing objects have all 4 currencies (KZT, TRY, RUB, USD)
5. Verify icon strings are valid iconify references

**Example Test**:

```typescript
import { describe, it, expect } from 'vitest'
import { getAllRequiredKeys, REQUIRED_LOCALES } from '~/specs/012-x-30-60/contracts/i18n-keys'

describe('Service page i18n contract', () => {
  it('should have all required keys in all locales', () => {
    const requiredKeys = getAllRequiredKeys()

    for (const locale of REQUIRED_LOCALES) {
      const messages = require(`~/i18n/locales/${locale}/services.json`)

      for (const key of requiredKeys) {
        const value = getNestedValue(messages, key)
        expect(value).toBeDefined()
      }
    }
  })
})
```

## Migration Strategy

**Phase 1**: Add new keys to English locale
**Phase 2**: Copy structure to other locales with placeholder text
**Phase 3**: Professional translation for ru/kk/tr
**Phase 4**: Content team fills in actual values

**Placeholder Format**: `"[TO BE TRANSLATED]"` or `"[CONTENT NEEDED]"`

---

**Data Model Complete**: Ready to create quickstart.md and proceed to Phase 2 (Tasks).
