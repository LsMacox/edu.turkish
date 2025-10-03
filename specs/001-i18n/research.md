# Research: i18n Translation Keys Quality Control

**Feature**: 001-i18n  
**Date**: 2025-10-03  
**Status**: Complete

## Overview

Research for implementing a TypeScript utility script to analyze i18n translation files for quality issues (duplicates, unused keys, missing translations across locales).

## Research Areas

### 1. File System Traversal & JSON Parsing

**Decision**: Use Node.js built-in `fs` and `path` modules with recursive directory scanning

**Rationale**:

- No external dependencies needed (fs, path are built-in)
- `fs.readdirSync` with `recursive: true` option (Node 18.17+) simplifies directory traversal
- `JSON.parse` handles nested structures natively
- Synchronous API is acceptable for CLI tool (simpler error handling, no callback hell)

**Alternatives considered**:

- **glob library**: Adds dependency, but project already uses pattern matching elsewhere. Built-in approach is sufficient.
- **fast-glob**: Overkill for ~64 files, adds dependency
- **Async fs promises**: More complex for CLI tool with no real performance benefit at this scale

**Implementation approach**:

```typescript
// Recursively read all .json files in i18n/locales/{locale}/
function loadLocaleFiles(locale: string): Map<string, object> {
  const localeDir = path.join(process.cwd(), 'i18n/locales', locale)
  const files = fs.readdirSync(localeDir, { recursive: true })
  // Filter .json, parse, flatten keys with dot notation
}
```

---

### 2. Nested Key Flattening (Dot Notation)

**Decision**: Recursive function to flatten nested JSON objects into dot-notation keys

**Rationale**:

- i18n files use nested structure: `{ pages: { blog: { title: "..." } } }`
- Code references use dot notation: `t('pages.blog.title')`
- Need to convert nested objects to flat key list for comparison

**Alternatives considered**:

- **flat npm package**: Adds dependency for simple recursive function
- **Keep nested structure**: Would complicate key comparison and usage detection

**Implementation approach**:

```typescript
function flattenKeys(obj: object, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}
```

---

### 3. Source Code Scanning for Key Usage

**Decision**: Regex-based scanning of source files for `t()`, `$t()`, `te()`, `tm()` calls

**Rationale**:

- Nuxt i18n uses these function names: `t()` (translate), `$t()` (in templates), `te()` (exists check), `tm()` (tree match)
- Regex can capture both static strings and template literals
- False positives (commented code) are acceptable - better than false negatives

**Alternatives considered**:

- **AST parsing (TypeScript Compiler API)**: More accurate but much slower, adds complexity and dependencies
- **ESLint plugin approach**: Requires ESLint infrastructure, overkill for one-off analysis
- **Simple string search**: Would miss template literals and complex patterns

**Implementation approach**:

```typescript
// Match: t('key'), $t("key"), t(`key`), te('key'), tm('key')
const I18N_CALL_REGEX = /\b(?:t|te|tm|\$t)\s*\(\s*['"`]([^'"`]+)['"`]/g

function scanSourceFile(filePath: string): Set<string> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const keys = new Set<string>()
  let match
  while ((match = I18N_CALL_REGEX.exec(content)) !== null) {
    keys.add(match[1])
  }
  return keys
}
```

**Known limitations**:

- Dynamic key construction (e.g., `t(\`pages.${page}.title\`)`) will be partially matched
- Commented-out code will be included (acceptable trade-off)
- Multi-line template literals may be missed (rare in practice)

---

### 4. Duplicate Key Detection

**Decision**: Use Map to track first occurrence, report subsequent occurrences

**Rationale**:

- Simple and efficient O(n) algorithm
- Tracks file path of first occurrence for better error messages
- Works across files within same locale

**Implementation approach**:

```typescript
interface DuplicateIssue {
  key: string
  locale: string
  firstFile: string
  duplicateFile: string
}

function findDuplicates(locale: string, fileMap: Map<string, object>): DuplicateIssue[] {
  const seen = new Map<string, string>() // key -> first file path
  const duplicates: DuplicateIssue[] = []

  for (const [filePath, content] of fileMap) {
    const keys = flattenKeys(content)
    for (const key of keys) {
      if (seen.has(key)) {
        duplicates.push({ key, locale, firstFile: seen.get(key)!, duplicateFile: filePath })
      } else {
        seen.set(key, filePath)
      }
    }
  }
  return duplicates
}
```

---

### 5. Cross-Locale Consistency Check

**Decision**: Build union of all keys across locales, report missing per locale

**Rationale**:

- Need to find keys present in some locales but not others
- Union set gives complete key inventory
- Per-locale diff shows what's missing where

**Implementation approach**:

```typescript
interface MissingKeyIssue {
  key: string
  presentIn: string[] // locales that have it
  missingIn: string[] // locales that don't
}

function findMissingKeys(allLocaleKeys: Map<string, Set<string>>): MissingKeyIssue[] {
  const allKeys = new Set<string>()
  for (const keys of allLocaleKeys.values()) {
    keys.forEach((k) => allKeys.add(k))
  }

  const issues: MissingKeyIssue[] = []
  for (const key of allKeys) {
    const presentIn: string[] = []
    const missingIn: string[] = []
    for (const [locale, keys] of allLocaleKeys) {
      if (keys.has(key)) {
        presentIn.push(locale)
      } else {
        missingIn.push(locale)
      }
    }
    if (missingIn.length > 0) {
      issues.push({ key, presentIn, missingIn })
    }
  }
  return issues
}
```

---

### 6. Output Format for LLM Consumption

**Decision**: Structured text output with clear sections and file paths

**Rationale**:

- LLM tools need clear, parseable output
- File paths enable automated fixes
- Grouping by issue type (duplicates, unused, missing) aids comprehension

**Output structure**:

```
=== i18n Translation Keys Quality Report ===

[DUPLICATE KEYS]
  - Key: "pages.blog.title"
    Locale: ru
    First occurrence: i18n/locales/ru/pages/blog.json
    Duplicate in: i18n/locales/ru/common.json

[UNUSED KEYS]
  - Key: "pages.old_feature.title"
    Locale: en
    File: i18n/locales/en/pages/old_feature.json
    (Not found in any source file)

[MISSING KEYS]
  - Key: "pages.new_feature.title"
    Present in: en, ru, kk
    Missing in: tr

✅ No issues found (if clean)
```

---

### 7. CLI Argument Parsing

**Decision**: Simple manual parsing for optional flags (no external library)

**Rationale**:

- Only need 1-2 optional flags (e.g., `--verbose`, `--json`)
- Existing scripts use manual parsing (see `translate.ts`)
- Keeps dependencies minimal

**Implementation approach**:

```typescript
interface CliOptions {
  verbose: boolean
  jsonOutput: boolean
}

function parseArgs(argv: string[]): CliOptions {
  return {
    verbose: argv.includes('--verbose'),
    jsonOutput: argv.includes('--json'),
  }
}
```

---

### 8. Testing Strategy

**Decision**: Vitest unit tests with fixture files

**Rationale**:

- Project already uses Vitest
- Can create small fixture JSON files and source files for testing
- Test each function independently (flatten, detect duplicates, scan usage, etc.)

**Test coverage areas**:

- Nested key flattening
- Duplicate detection
- Usage scanning (various patterns)
- Missing key detection
- Edge cases (empty files, invalid JSON, no translations)

---

## Performance Considerations

**Expected scale**:

- ~64 JSON files (4 locales × 16 files)
- ~200-500 source files (.vue, .ts, .js)
- Total file size: <5MB

**Performance target**: <5 seconds total execution time

**Optimization strategies**:

- Synchronous I/O is acceptable (simpler, no perf issue at this scale)
- Regex compilation happens once
- Map/Set for O(1) lookups
- No need for streaming or chunking

---

## Error Handling

**Approach**: Fail fast with clear error messages

**Error scenarios**:

1. **Invalid JSON**: Catch parse errors, report file path, exit with error
2. **Missing directories**: Check `i18n/locales/{locale}` exists before scanning
3. **File read errors**: Catch and report with file path
4. **Empty locales**: Warn but continue (valid state during development)

**Exit codes**:

- 0: Success (issues may or may not be found, but script ran successfully)
- 1: Execution error (invalid JSON, missing directory, etc.)

---

## Dependencies

**Runtime**:

- Node.js 18.17+ (for `fs.readdirSync` with `recursive` option)
- TypeScript 5.9+ (for type safety)
- tsx (already in devDependencies) for execution

**Development**:

- Vitest (already in devDependencies) for testing
- ESLint/Prettier (already configured) for code quality

**No additional dependencies required** ✅

---

## Integration with Existing Codebase

**Alignment with existing scripts**:

- Follow `scripts/translate.ts` pattern:
  - CLI argument parsing
  - Clear console output
  - TypeScript with proper types
  - Error handling with try/catch
  - Exit codes

**Documentation pattern**:

- Follow `docs/scripts/TRANSLATE.md` structure:
  - Russian language
  - Purpose section
  - Prerequisites
  - Usage examples
  - Options
  - Output format
  - Troubleshooting

**package.json integration**:

- Add script: `"i18n:check": "tsx scripts/i18n-check.ts"`
- Follows pattern of `"translate": "tsx scripts/translate.ts"`

---

## Conclusion

All technical decisions are made with no remaining unknowns. The implementation is straightforward using Node.js built-ins with no external dependencies. The approach aligns with existing script patterns in the codebase and constitutional requirements.

**Ready for Phase 1: Design & Contracts**
