# Feature Specification: i18n Translation Keys Quality Control Script

**Feature Branch**: `001-i18n`  
**Created**: 2025-10-03  
**Status**: Draft  
**Input**: User description: "я разработчик, хочу чтоб у нас не было дублей переводов в приложении у i18n, для этого хочу создать скрипт который будет искать дубликаты ключей, неиспользуемые ключи в приложении, присутвующие в одной локале ключи а в другой остутвует"

---

## User Scenarios & Testing

### Primary User Story

As a developer maintaining the edu.turkish application, I need to ensure translation key quality across all locales (en, ru, kk, tr) to prevent duplicate keys, identify unused keys, and detect missing translations. I want to run a script that analyzes the i18n locale files and reports issues so I can maintain consistency and clean up the translation files.

### Acceptance Scenarios

1. **Given** translation files exist in `i18n/locales/{lang}/**/*.json` for all four locales, **When** the developer runs the quality control script, **Then** the script must scan all locale files and report any duplicate keys within the same locale.

2. **Given** translation keys are defined in locale files, **When** the script analyzes the application codebase (components, pages, composables, server code), **Then** the script must identify which translation keys are never referenced in the code and report them as unused.

3. **Given** translation keys exist in one locale but not in others, **When** the script compares all locales, **Then** the script must report missing keys for each locale, showing which keys are present in some locales but absent in others.

4. **Given** the script has completed its analysis, **When** issues are found, **Then** the script must output a clear, structured report showing:
   - Duplicate keys (key name, file path, locale)
   - Unused keys (key name, file path, locale)
   - Missing keys (key name, present in which locales, missing in which locales)

5. **Given** the script runs successfully, **When** no issues are found, **Then** the script must report that all translation keys are valid and consistent.

### Edge Cases

- What happens when a translation key is used dynamically (e.g., constructed at runtime with variables)?
- How does the system handle nested keys in JSON files?
- What happens when a locale directory is missing or empty?
- How does the script handle keys that are used in commented-out code?
- What happens if translation files contain invalid JSON?

## Requirements

### Functional Requirements

- **FR-001**: Script MUST detect duplicate keys within the same locale file or across multiple files in the same locale directory.

- **FR-002**: Script MUST scan the application codebase (`.vue`, `.ts`, `.js` files in `app/`, `server/`, `components/`, `pages/`, `composables/` directories) to identify which translation keys are actually used.

- **FR-003**: Script MUST identify translation keys that exist in locale files but are never referenced in the application code (unused keys).

- **FR-004**: Script MUST compare all four locales (en, ru, kk, tr) and identify keys that exist in some locales but are missing in others.

- **FR-005**: Script MUST output a structured report with three sections: duplicate keys, unused keys, and missing keys across locales.

- **FR-006**: Script MUST support the nested JSON structure used in locale files (e.g., `pages.blog.meta.title`).

- **FR-007**: Script MUST be executable from the command line and always exit with code 0 when execution is successful, regardless of whether quality issues are found. The script's purpose is to report issues, not to fail builds.

- **FR-008**: Script MUST handle all four supported locales: en, ru, kk, tr.

- **FR-009**: Report MUST include file paths and line numbers where issues are found to help developers locate and fix problems.

- **FR-010**: Script MUST be designed for manual execution by developers. The primary use case is to provide detailed output that can be analyzed by LLM tools to understand inconsistencies and automatically fix them.

### Key Entities

- **Translation Key**: A unique identifier used to reference a translated string, represented as a dot-notation path (e.g., `pages.blog.hero.title`). Can be nested within JSON structure.

- **Locale**: A language variant (en, ru, kk, tr) containing a complete set of translation files organized in subdirectories (pages, components, common files).

- **Translation File**: A JSON file containing key-value pairs for translations, organized by feature or component.

- **Quality Issue**: A detected problem in translation files, categorized as duplicate key, unused key, or missing key across locales.

---

## Review & Acceptance Checklist

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

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
