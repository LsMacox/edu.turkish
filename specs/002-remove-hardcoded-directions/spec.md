# Feature Specification: Remove Hardcoded Study Directions

**Feature Branch**: `002-remove-hardcoded-directions`  
**Created**: 2025-10-03  
**Status**: Draft  
**Input**: User description: "Хочу чтобы у меня не было лишних направлений directions.ts и думаю этот файл вовсе не нужен и его переводы, так как у нас есть таблица study_direction и его таблица с переводами, и поэтому хотел бы выпилить и перенести например нужные направления в сидер, ну также избавиться от всех не нужных направлений и оставить только те которые есть в assets/json/university которые там используется и добавить которые там используется если нет в сидер. И я думаю таким образом система станет понятнее и менее разношерстной"

## Execution Flow (main)

```
1. Parse user description from Input
   → ✅ Description provided: migrate from hardcoded directions to database
2. Extract key concepts from description
   → ✅ Identified: eliminate hardcoded file, use database, seed only used directions
3. For each unclear aspect:
   → No critical ambiguities found
4. Fill User Scenarios & Testing section
   → ✅ System maintenance and data consistency scenarios defined
5. Generate Functional Requirements
   → ✅ All requirements testable and specific
6. Identify Key Entities
   → ✅ Study Direction entity identified
7. Run Review Checklist
   → ✅ No implementation details, focused on data requirements
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

As a system administrator, I need the study directions (academic fields) to be managed through the database rather than hardcoded files, so that the system is more maintainable and only contains directions that are actually used by universities in the system.

### Acceptance Scenarios

1. **Given** the system has hardcoded study directions in code files, **When** the migration is complete, **Then** all study directions must be stored in the database with proper translations
2. **Given** university data files reference specific study directions, **When** the system is seeded, **Then** only those referenced directions must exist in the database
3. **Given** a study direction exists in the database, **When** querying universities by direction, **Then** the system must return correct results with localized direction names
4. **Given** the hardcoded direction files are removed, **When** the application runs, **Then** it must function without errors and display all direction data from the database

### Edge Cases

- What happens when a university JSON file references a direction that doesn't exist in the seed data?
- How does the system handle direction translations for all supported locales (en, ru, kk, tr)?
- What happens to existing university-direction relationships during migration?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST store all study directions in the database table `study_directions` with translations in `study_direction_translations`
- **FR-002**: System MUST seed only study directions that are actually referenced in university data files (in `app/assets/json/universities/*.json`)
- **FR-003**: System MUST provide translations for each study direction in all supported locales (en, ru, kk, tr)
- **FR-004**: System MUST maintain unique slugs for each study direction across all locales
- **FR-005**: System MUST preserve existing university-to-direction relationships during migration
- **FR-006**: System MUST remove all hardcoded direction type definitions and constants from code files
- **FR-007**: System MUST ensure the import script can create missing directions when importing university data
- **FR-008**: System MUST validate that all direction references in university JSON files have corresponding database entries after seeding

### Key Entities _(include if feature involves data)_

- **Study Direction**: Represents an academic field or area of study (e.g., "Computer Science", "Medicine"). Contains:
  - Unique identifier
  - Creation/update timestamps
  - Relationships to universities offering programs in this direction
  - Translations in multiple languages with localized names, descriptions, and SEO-friendly slugs

---

## Clarifications

### Session 1 - 2025-10-03

**Q: How should existing direction data be migrated?**  
**A:** No migration plan needed - project is still in local development environment. Fresh seed approach is acceptable.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
