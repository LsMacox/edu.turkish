# Data Model: i18n Translation Keys Quality Control

**Feature**: 001-i18n  
**Date**: 2025-10-03

## Overview

This document defines the data structures used by the i18n quality control script. The script operates on file system data (JSON translation files and source code) and produces structured reports.

## Core Entities

### 1. TranslationKey

Represents a flattened translation key in dot notation.

**Fields**:

- `key`: string - Full dot-notation path (e.g., `"pages.blog.hero.title"`)
- `locale`: string - Locale code (`"en"`, `"ru"`, `"kk"`, `"tr"`)
- `filePath`: string - Relative path to JSON file containing this key
- `value`: string | object - The translation value (string or nested object for arrays)

**Validation**:

- `key` must be non-empty string
- `locale` must be one of: `en`, `ru`, `kk`, `tr`
- `filePath` must start with `i18n/locales/{locale}/`

**Example**:

```typescript
{
  key: "pages.blog.hero.title",
  locale: "ru",
  filePath: "i18n/locales/ru/pages/blog.json",
  value: "Блог"
}
```

---

### 2. LocaleKeySet

Represents all translation keys for a single locale.

**Fields**:

- `locale`: string - Locale code
- `keys`: Set<string> - Set of all flattened keys in this locale
- `keyToFile`: Map<string, string> - Maps each key to its source file path

**Relationships**:

- One LocaleKeySet per locale (4 total: en, ru, kk, tr)
- Contains multiple TranslationKey entries

**Example**:

```typescript
{
  locale: "en",
  keys: Set(["pages.home.title", "pages.blog.title", ...]),
  keyToFile: Map([
    ["pages.home.title", "i18n/locales/en/pages/home.json"],
    ["pages.blog.title", "i18n/locales/en/pages/blog.json"]
  ])
}
```

---

### 3. SourceFileUsage

Represents translation key usage found in source code.

**Fields**:

- `filePath`: string - Path to source file (.vue, .ts, .js)
- `usedKeys`: Set<string> - Set of translation keys referenced in this file
- `lineNumbers`: Map<string, number[]> - Maps each key to line numbers where it appears

**Validation**:

- `filePath` must match pattern: `(app|server|components|pages|composables)/**/*.(vue|ts|js)`

**Example**:

```typescript
{
  filePath: "app/pages/blog.vue",
  usedKeys: Set(["pages.blog.title", "pages.blog.hero.subtitle"]),
  lineNumbers: Map([
    ["pages.blog.title", [15, 42]],
    ["pages.blog.hero.subtitle", [23]]
  ])
}
```

---

### 4. QualityIssue (Base)

Abstract base for all quality issues detected.

**Fields**:

- `type`: "duplicate" | "unused" | "missing"
- `severity`: "error" | "warning"

---

### 5. DuplicateKeyIssue (extends QualityIssue)

Represents a translation key that appears multiple times in the same locale.

**Fields**:

- `type`: "duplicate"
- `severity`: "error"
- `key`: string - The duplicated key
- `locale`: string - Locale where duplication occurs
- `firstOccurrence`: string - File path of first occurrence
- `duplicateOccurrence`: string - File path of duplicate

**Validation**:

- `firstOccurrence` and `duplicateOccurrence` must be different file paths
- Both files must be in same locale directory

**Example**:

```typescript
{
  type: "duplicate",
  severity: "error",
  key: "common.submit",
  locale: "ru",
  firstOccurrence: "i18n/locales/ru/common.json",
  duplicateOccurrence: "i18n/locales/ru/components/forms.json"
}
```

---

### 6. UnusedKeyIssue (extends QualityIssue)

Represents a translation key that exists but is never used in source code.

**Fields**:

- `type`: "unused"
- `severity`: "warning"
- `key`: string - The unused key
- `locale`: string - Locale containing the unused key
- `filePath`: string - File path where key is defined

**Validation**:

- Key must exist in locale files
- Key must not appear in any source file scan results

**Example**:

```typescript
{
  type: "unused",
  severity: "warning",
  key: "pages.old_feature.title",
  locale: "en",
  filePath: "i18n/locales/en/pages/old_feature.json"
}
```

---

### 7. MissingKeyIssue (extends QualityIssue)

Represents a translation key that exists in some locales but not others.

**Fields**:

- `type`: "missing"
- `severity`: "error"
- `key`: string - The missing key
- `presentIn`: string[] - Array of locale codes where key exists
- `missingIn`: string[] - Array of locale codes where key is missing

**Validation**:

- `presentIn` must be non-empty
- `missingIn` must be non-empty
- `presentIn` + `missingIn` should equal all supported locales

**Example**:

```typescript
{
  type: "missing",
  severity: "error",
  key: "pages.new_feature.cta",
  presentIn: ["en", "ru", "kk"],
  missingIn: ["tr"]
}
```

---

### 8. QualityReport

The final output structure containing all detected issues.

**Fields**:

- `timestamp`: Date - When the report was generated
- `scannedLocales`: string[] - Locales that were scanned
- `totalKeys`: number - Total unique keys across all locales
- `totalSourceFiles`: number - Number of source files scanned
- `duplicateIssues`: DuplicateKeyIssue[] - All duplicate key issues
- `unusedIssues`: UnusedKeyIssue[] - All unused key issues
- `missingIssues`: MissingKeyIssue[] - All missing key issues
- `summary`: ReportSummary - Aggregated counts

**Relationships**:

- Contains arrays of DuplicateKeyIssue, UnusedKeyIssue, MissingKeyIssue
- One report generated per script execution

**Example**:

```typescript
{
  timestamp: new Date("2025-10-03T00:00:00Z"),
  scannedLocales: ["en", "ru", "kk", "tr"],
  totalKeys: 342,
  totalSourceFiles: 187,
  duplicateIssues: [/* ... */],
  unusedIssues: [/* ... */],
  missingIssues: [/* ... */],
  summary: {
    duplicateCount: 2,
    unusedCount: 15,
    missingCount: 8,
    totalIssues: 25
  }
}
```

---

### 9. ReportSummary

Aggregated statistics for the quality report.

**Fields**:

- `duplicateCount`: number - Total duplicate key issues
- `unusedCount`: number - Total unused key issues
- `missingCount`: number - Total missing key issues
- `totalIssues`: number - Sum of all issue counts

**Validation**:

- All counts must be non-negative integers
- `totalIssues` must equal sum of individual counts

---

## Data Flow

```
1. Load Translation Files
   ↓
   [JSON Files] → [LocaleKeySet × 4]

2. Scan Source Code
   ↓
   [.vue/.ts/.js Files] → [SourceFileUsage × N]

3. Detect Duplicates
   ↓
   [LocaleKeySet] → [DuplicateKeyIssue[]]

4. Detect Unused Keys
   ↓
   [LocaleKeySet + SourceFileUsage] → [UnusedKeyIssue[]]

5. Detect Missing Keys
   ↓
   [LocaleKeySet × 4] → [MissingKeyIssue[]]

6. Generate Report
   ↓
   [All Issues] → [QualityReport]

7. Output
   ↓
   [QualityReport] → [Console/JSON]
```

---

## State Transitions

The script is stateless - each execution is independent. However, the analysis follows this sequence:

1. **Initial State**: File system with translation files and source code
2. **Loading State**: Reading and parsing JSON files
3. **Analysis State**: Detecting issues (duplicates, unused, missing)
4. **Reporting State**: Formatting and outputting results
5. **Terminal State**: Script exits with report

No persistent state is maintained between executions.

---

## Validation Rules

### Cross-Locale Consistency

- All locales should have the same set of keys (MissingKeyIssue if not)
- Key structure (nesting) should be consistent across locales

### Key Uniqueness

- Within a locale, each key must appear exactly once (DuplicateKeyIssue if not)

### Key Usage

- Keys defined in translation files should be used in source code (UnusedKeyIssue if not)
- Keys used in source code should exist in translation files (not checked - runtime error)

---

## Edge Cases

### Dynamic Key Construction

Keys constructed at runtime (e.g., `t(\`pages.${page}.title\`)`) will be partially matched:

- The static prefix `"pages."` will be captured
- The full dynamic key won't be validated
- This is acceptable - better to have false negatives than false positives

### Commented Code

Keys in commented-out code will be detected as "used":

- This is acceptable - prevents accidental deletion of keys that might be uncommented
- Manual review can identify truly unused keys

### Array Values

Translation values that are arrays (e.g., FAQ items) are preserved:

- The key points to the entire array
- Individual array indices are not treated as separate keys

### Empty Locales

If a locale directory is empty or missing:

- Script should warn but continue
- All keys will be reported as missing in that locale

---

## TypeScript Type Definitions

```typescript
type Locale = 'en' | 'ru' | 'kk' | 'tr'

interface TranslationKey {
  key: string
  locale: Locale
  filePath: string
  value: string | object
}

interface LocaleKeySet {
  locale: Locale
  keys: Set<string>
  keyToFile: Map<string, string>
}

interface SourceFileUsage {
  filePath: string
  usedKeys: Set<string>
  lineNumbers: Map<string, number[]>
}

type IssueType = 'duplicate' | 'unused' | 'missing'
type IssueSeverity = 'error' | 'warning'

interface QualityIssue {
  type: IssueType
  severity: IssueSeverity
}

interface DuplicateKeyIssue extends QualityIssue {
  type: 'duplicate'
  severity: 'error'
  key: string
  locale: Locale
  firstOccurrence: string
  duplicateOccurrence: string
}

interface UnusedKeyIssue extends QualityIssue {
  type: 'unused'
  severity: 'warning'
  key: string
  locale: Locale
  filePath: string
}

interface MissingKeyIssue extends QualityIssue {
  type: 'missing'
  severity: 'error'
  key: string
  presentIn: Locale[]
  missingIn: Locale[]
}

interface ReportSummary {
  duplicateCount: number
  unusedCount: number
  missingCount: number
  totalIssues: number
}

interface QualityReport {
  timestamp: Date
  scannedLocales: Locale[]
  totalKeys: number
  totalSourceFiles: number
  duplicateIssues: DuplicateKeyIssue[]
  unusedIssues: UnusedKeyIssue[]
  missingIssues: MissingKeyIssue[]
  summary: ReportSummary
}

interface CliOptions {
  verbose: boolean
  jsonOutput: boolean
}
```

---

## Conclusion

The data model is straightforward with clear entity boundaries and validation rules. All entities are immutable value objects with no complex state management required. The model supports the three core quality checks (duplicates, unused, missing) and produces structured output suitable for both human and LLM consumption.
