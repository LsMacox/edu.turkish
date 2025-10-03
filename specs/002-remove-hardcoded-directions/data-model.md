# Data Model: Study Directions

**Feature**: Remove Hardcoded Study Directions  
**Date**: 2025-10-03

## Overview

This document describes the data model for study directions. The tables already exist in the Prisma schema - this refactor does not change the schema, only how the data is populated and accessed.

## Entity: StudyDirection

**Table**: `study_directions`

### Fields

| Field       | Type       | Constraints     | Description                      |
| ----------- | ---------- | --------------- | -------------------------------- |
| id          | Int        | PK, AUTO_INC    | Unique identifier                |
| createdAt   | DateTime   | DEFAULT now()   | Creation timestamp               |
| updatedAt   | DateTime   | AUTO_UPDATE     | Last update timestamp            |

### Relationships

- **translations** (1:N): One direction has many translations (one per locale)
- **universityDirections** (1:N): One direction can be linked to many universities via pivot table

### Validation Rules

- Direction must have at least one translation
- Direction slug must be unique per locale (enforced by DB unique constraint on translations table)

---

## Entity: StudyDirectionTranslation

**Table**: `study_direction_translations`

### Fields

| Field        | Type       | Constraints                           | Description                           |
| ------------ | ---------- | ------------------------------------- | ------------------------------------- |
| id           | Int        | PK, AUTO_INC                          | Unique identifier                     |
| directionId  | Int        | FK → study_directions.id, CASCADE DEL | Reference to parent direction         |
| locale       | String(5)  | NOT NULL                              | Locale code (en, ru, kk, tr)          |
| name         | String(255)| NULLABLE                              | Localized direction name              |
| description  | Text       | NULLABLE                              | Localized description                 |
| slug         | String(255)| NOT NULL                              | SEO-friendly slug for this locale     |
| createdAt    | DateTime   | DEFAULT now()                         | Creation timestamp                    |
| updatedAt    | DateTime   | AUTO_UPDATE                           | Last update timestamp                 |

### Unique Constraints

1. **[directionId, locale]**: Each direction must have exactly one translation per locale
2. **[locale, slug]**: Each slug must be unique within a locale (for SEO routing)

### Validation Rules

- Slug must follow pattern: lowercase, hyphens only (e.g., "computer-science")
- Name is required for display
- Description is optional
- All 4 supported locales (en, ru, kk, tr) must have translations

---

## Entity: UniversityStudyDirection (Pivot)

**Table**: `university_pivot_study_directions`

### Fields

| Field        | Type      | Constraints                        | Description                       |
| ------------ | --------- | ---------------------------------- | --------------------------------- |
| id           | Int       | PK, AUTO_INC                       | Unique identifier                 |
| universityId | Int       | FK → universities.id, CASCADE DEL  | Reference to university           |
| directionId  | Int       | FK → study_directions.id, CASCADE DEL | Reference to direction         |
| createdAt    | DateTime  | DEFAULT now()                      | Link creation timestamp           |
| updatedAt    | DateTime  | AUTO_UPDATE                        | Link update timestamp             |

### Unique Constraints

1. **[universityId, directionId]**: Each university-direction pair must be unique

### Relationships

- **university**: Belongs to one University
- **direction**: Belongs to one StudyDirection

---

## Seed Data Structure

### Source Data

Direction slugs are extracted from university JSON files:
- **Location**: `app/assets/json/universities/*.json`
- **Field**: `programs[].direction_slug` and/or `directions[]` array
- **Format**: Kebab-case strings (e.g., "computer-engineering", "medicine")

### Seed Data Format

```typescript
interface DirectionSeedData {
  slug: string
  translations: {
    en: { name: string; description?: string }
    ru: { name: string; description?: string }
    kk: { name: string; description?: string }
    tr: { name: string; description?: string }
  }
}
```

### Example Seed Entry

```typescript
{
  slug: "computer-engineering",
  translations: {
    en: { name: "Computer Engineering" },
    ru: { name: "Компьютерная инженерия" },
    kk: { name: "Компьютерлік инженерия" },
    tr: { name: "Bilgisayar Mühendisliği" }
  }
}
```

### Seed Process

1. **Scan** all university JSON files for unique direction slugs
2. **Map** each slug to its translations from existing i18n files
3. **Upsert** StudyDirection records:
   - Find or create direction record
   - For each locale, upsert translation record with slug, name, description
4. **Validate** all 4 locales have translations

---

## State Transitions

N/A - Study directions are relatively static master data. No complex state machine.

Possible operations:
- **Create**: Via seed or admin interface (future)
- **Update**: Update translations
- **Delete**: Orphaned directions (no universities reference them) can be cleaned up
- **Link**: University ↔ Direction via import script

---

## Validation Summary

### Database-Level Constraints

✅ Enforced by Prisma schema:
- Unique `[directionId, locale]`
- Unique `[locale, slug]`
- Foreign key cascades
- NOT NULL on required fields

### Application-Level Validation

Required in seed script:
- All 4 locales must have translations
- Slug format validation (lowercase, hyphens)
- At least one direction must be seeded

### Import Script Validation

- Direction slug must exist in database (via foreign key)
- If direction doesn't exist, import script creates it (already implemented in `ensureDirectionAndTranslation()`)

---

## Migration Notes

**From**: Hardcoded `DirectionSlug` type and `ALL_DIRECTIONS` array in `app/types/directions.ts`  
**To**: Database-driven via `study_directions` and `study_direction_translations` tables

**Data Flow**:
1. Old: TypeScript enum → runtime validation → hardcoded i18n JSON
2. New: Database seed → Prisma query → dynamic i18n from DB

**No schema changes needed** - tables already exist and are correctly structured.
