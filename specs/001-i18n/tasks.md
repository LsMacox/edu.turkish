# Tasks: i18n Translation Keys Quality Control Script

**Feature**: 001-i18n  
**Branch**: `001-i18n`  
**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/001-i18n/`  
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Overview

Implement a TypeScript utility script (`scripts/i18n-check.ts`) that analyzes i18n translation files to detect duplicate keys, unused keys, and missing translations across locales. The script will be executable via `npm run i18n:check` with optional `--verbose` and `--json` flags.

**Tech Stack**:

- TypeScript 5.9+
- Node.js built-in modules (fs, path)
- Vitest for testing
- tsx for execution

**Key Files**:

- `scripts/i18n-check.ts` - Main script
- `tests/scripts/i18n-check.test.ts` - Unit tests
- `docs/scripts/I18N_CHECK.md` - Russian documentation
- `package.json` - Add npm script

---

## Phase 3.1: Setup

### T001: ✅ Add npm script to package.json

**File**: `package.json`  
**Description**: Add `"i18n:check": "tsx scripts/i18n-check.ts"` to the `scripts` section, following the existing pattern of `translate` and `import:university` scripts.

**Acceptance**:

- Script entry exists in package.json
- Can be executed with `npm run i18n:check`
- Follows existing naming convention (colon separator)

---

### T002: ✅ Create test directory structure

**File**: `tests/scripts/` (directory)  
**Description**: Create `tests/scripts/` directory if it doesn't exist to house the test file for the i18n-check script.

**Acceptance**:

- Directory `tests/scripts/` exists
- Follows existing test structure pattern

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### T003 [P]: ✅ Unit test for flattenKeys function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for the `flattenKeys()` function that converts nested JSON objects to dot-notation key arrays. Test cases:

- Simple flat object: `{ a: "1", b: "2" }` → `["a", "b"]`
- Nested object: `{ pages: { home: { title: "x" } } }` → `["pages.home.title"]`
- Mixed nesting levels
- Arrays as values (should be treated as leaf nodes)
- Empty object

**Acceptance**:

- Test file created with describe block for flattenKeys
- All test cases implemented
- Tests FAIL (function not implemented yet)

---

### T004 [P]: ✅ Unit test for loadLocaleFiles function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `loadLocaleFiles()` function that loads all JSON files from a locale directory. Test cases:

- Load valid JSON files from test fixture directory
- Return Map<filePath, parsedContent>
- Handle nested directory structure
- Throw error on invalid JSON

**Acceptance**:

- Test cases implemented with fixture files
- Tests FAIL (function not implemented yet)
- Fixture directory created in `tests/scripts/fixtures/i18n/`

---

### T005 [P]: ✅ Unit test for findDuplicateKeys function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `findDuplicateKeys()` function that detects duplicate keys within a locale. Test cases:

- No duplicates: returns empty array
- One duplicate across two files
- Multiple duplicates
- Duplicate in same file (edge case)

**Acceptance**:

- Test cases implemented
- Tests FAIL (function not implemented yet)
- Uses fixture data

---

### T006 [P]: ✅ Unit test for scanSourceFileForKeys function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `scanSourceFileForKeys()` function that extracts i18n key usage from source code. Test cases:

- Detect `t('key')` syntax
- Detect `$t("key")` syntax (template)
- Detect `te('key')` and `tm('key')`
- Detect template literals: `t(\`key\`)`
- Ignore commented-out code (acceptable false positive)
- Return Set of found keys

**Acceptance**:

- Test cases with various syntax patterns
- Tests FAIL (function not implemented yet)
- Test fixtures include sample .vue and .ts files

---

### T007 [P]: ✅ Unit test for findUnusedKeys function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `findUnusedKeys()` function that identifies keys defined but never used. Test cases:

- All keys used: returns empty array
- Some keys unused: returns UnusedKeyIssue array
- Keys used in multiple files: not reported as unused

**Acceptance**:

- Test cases implemented
- Tests FAIL (function not implemented yet)
- Uses both locale and source file fixtures

---

### T008 [P]: ✅ Unit test for findMissingKeys function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `findMissingKeys()` function that finds keys present in some locales but not others. Test cases:

- All locales have same keys: returns empty array
- Key missing in one locale: returns MissingKeyIssue
- Key missing in multiple locales
- Key only in one locale

**Acceptance**:

- Test cases implemented
- Tests FAIL (function not implemented yet)
- Uses multi-locale fixture data

---

### T009 [P]: ✅ Unit test for formatTextReport function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `formatTextReport()` function that formats QualityReport as human-readable text. Test cases:

- Report with no issues: shows success message
- Report with duplicates: formats duplicate section
- Report with unused keys: formats unused section
- Report with missing keys: formats missing section
- Report with all issue types: formats all sections

**Acceptance**:

- Test cases cover all output scenarios
- Tests FAIL (function not implemented yet)
- Validates output structure (headers, sections, file paths)

---

### T010 [P]: ✅ Unit test for formatJsonReport function

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write Vitest test for `formatJsonReport()` function that formats QualityReport as JSON. Test cases:

- Valid JSON output
- Conforms to schema in contracts/output-format.md
- All required fields present
- Arrays are present (may be empty)

**Acceptance**:

- Test cases validate JSON structure
- Tests FAIL (function not implemented yet)
- Uses JSON.parse to validate output

---

### T011 [P]: ✅ Integration test for CLI execution

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Write integration test that executes the full script workflow. Test cases:

- Run script with fixture data
- Verify exit code 0 on success
- Verify report contains expected issues
- Test --verbose flag
- Test --json flag

**Acceptance**:

- Integration test suite created
- Tests FAIL (script not implemented yet)
- Uses child_process or similar to execute script

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### T012: ✅ Define TypeScript types and interfaces

**File**: `scripts/i18n-check.ts`  
**Description**: Create all TypeScript type definitions from data-model.md at the top of the script file:

- `Locale` type
- `TranslationKey`, `LocaleKeySet`, `SourceFileUsage` interfaces
- `QualityIssue`, `DuplicateKeyIssue`, `UnusedKeyIssue`, `MissingKeyIssue` interfaces
- `QualityReport`, `ReportSummary` interfaces
- `CliOptions` interface

**Acceptance**:

- All types defined
- Follows TypeScript best practices
- Matches data-model.md specifications
- No implementation yet, just type definitions

**Dependencies**: None

---

### T013: ✅ Implement flattenKeys function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement recursive `flattenKeys(obj: object, prefix = ''): string[]` function that converts nested JSON to dot-notation keys. Follow the algorithm from research.md.

**Acceptance**:

- Function implemented
- Tests from T003 now PASS
- Handles nested objects correctly
- Arrays treated as leaf nodes

**Dependencies**: T003 (test must exist and fail), T012 (types)

---

### T014: ✅ Implement loadLocaleFiles function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `loadLocaleFiles(locale: Locale): Map<string, object>` function that:

- Reads all .json files from `i18n/locales/{locale}/` recursively
- Parses JSON content
- Returns Map of filePath → parsed content
- Throws error on invalid JSON with file path

**Acceptance**:

- Function implemented
- Tests from T004 now PASS
- Uses fs.readdirSync with recursive option
- Error messages include file paths

**Dependencies**: T004 (test), T012 (types)

---

### T015: ✅ Implement findDuplicateKeys function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `findDuplicateKeys(locale: Locale, fileMap: Map<string, object>): DuplicateKeyIssue[]` function that:

- Flattens keys from all files
- Tracks first occurrence of each key
- Reports subsequent occurrences as duplicates
- Returns array of DuplicateKeyIssue

**Acceptance**:

- Function implemented
- Tests from T005 now PASS
- Uses flattenKeys internally
- Tracks file paths correctly

**Dependencies**: T005 (test), T012 (types), T013 (flattenKeys)

---

### T016: ✅ Implement scanSourceFileForKeys function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `scanSourceFileForKeys(filePath: string): Set<string>` function that:

- Reads source file content
- Uses regex to find i18n function calls: `t()`, `$t()`, `te()`, `tm()`
- Extracts key strings from function calls
- Returns Set of found keys

**Acceptance**:

- Function implemented
- Tests from T006 now PASS
- Regex pattern matches all i18n function variants
- Handles both single and double quotes, template literals

**Dependencies**: T006 (test), T012 (types)

---

### T017: ✅ Implement scanAllSourceFiles function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `scanAllSourceFiles(): Set<string>` function that:

- Scans directories: `app/`, `server/`, `components/`, `pages/`, `composables/`
- Filters for .vue, .ts, .js files
- Calls scanSourceFileForKeys for each file
- Returns union Set of all found keys

**Acceptance**:

- Function implemented
- Recursively scans all specified directories
- Aggregates keys from all files
- Handles file read errors gracefully

**Dependencies**: T012 (types), T016 (scanSourceFileForKeys)

---

### T018: ✅ Implement findUnusedKeys function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `findUnusedKeys(localeKeySets: Map<Locale, LocaleKeySet>, usedKeys: Set<string>): UnusedKeyIssue[]` function that:

- Compares locale keys against used keys
- Identifies keys that exist but are never used
- Returns array of UnusedKeyIssue with file paths

**Acceptance**:

- Function implemented
- Tests from T007 now PASS
- Correctly identifies unused keys per locale
- Includes file path information

**Dependencies**: T007 (test), T012 (types)

---

### T019: ✅ Implement findMissingKeys function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `findMissingKeys(localeKeySets: Map<Locale, LocaleKeySet>): MissingKeyIssue[]` function that:

- Builds union of all keys across locales
- For each key, determines which locales have it
- Reports keys missing in any locale
- Returns array of MissingKeyIssue

**Acceptance**:

- Function implemented
- Tests from T008 now PASS
- Correctly identifies missing keys
- Shows presentIn and missingIn arrays

**Dependencies**: T008 (test), T012 (types)

---

### T020: ✅ Implement formatTextReport function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `formatTextReport(report: QualityReport): string` function that:

- Formats report according to contracts/output-format.md
- Includes header with summary statistics
- Sections for duplicates, unused, missing (if present)
- Success message if no issues
- Uses Unicode characters for visual appeal

**Acceptance**:

- Function implemented
- Tests from T009 now PASS
- Output matches contract specification
- Readable and well-formatted

**Dependencies**: T009 (test), T012 (types)

---

### T021: ✅ Implement formatJsonReport function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `formatJsonReport(report: QualityReport): string` function that:

- Serializes QualityReport to JSON
- Conforms to schema in contracts/output-format.md
- Pretty-printed with 2-space indentation
- All required fields present

**Acceptance**:

- Function implemented
- Tests from T010 now PASS
- Valid JSON output
- Matches schema exactly

**Dependencies**: T010 (test), T012 (types)

---

### T022: ✅ Implement CLI argument parsing

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `parseArgs(argv: string[]): CliOptions` function that:

- Parses `--verbose` flag
- Parses `--json` flag
- Returns CliOptions object
- Simple manual parsing (no external library)

**Acceptance**:

- Function implemented
- Handles both flags correctly
- Returns default values when flags absent
- Follows existing script patterns

**Dependencies**: T012 (types)

---

### T023: ✅ Implement main orchestration function

**File**: `scripts/i18n-check.ts`  
**Description**: Implement `main()` async function that:

- Parses CLI arguments
- Loads all locale files (en, ru, kk, tr)
- Scans all source files
- Runs all analysis functions (duplicates, unused, missing)
- Builds QualityReport
- Formats and outputs report (text or JSON)
- Handles errors with try/catch
- Returns appropriate exit code

**Acceptance**:

- Function implemented
- Integration tests from T011 now PASS
- Orchestrates all components correctly
- Error handling with clear messages
- Exit code 0 on success, 1 on errors

**Dependencies**: T011 (test), T012-T022 (all functions)

---

### T024: ✅ Add script entry point and execution

**File**: `scripts/i18n-check.ts`  
**Description**: Add script entry point at bottom of file:

- Check if running as main module
- Call main() function
- Handle process.exit with exit code
- Add shebang line for direct execution (optional)

**Acceptance**:

- Script can be executed via tsx
- Script can be executed via npm run
- Exit codes work correctly
- Follows existing script patterns

**Dependencies**: T023 (main function)

---

## Phase 3.4: Integration & Error Handling

### T025: ✅ Add comprehensive error handling

**File**: `scripts/i18n-check.ts`  
**Description**: Add error handling throughout the script:

- Invalid JSON: catch parse errors, show file path
- Missing directories: check existence before scanning
- File read errors: catch and report with file path
- Empty locales: warn but continue
- Wrap main() in try/catch with clear error messages

**Acceptance**:

- All error scenarios handled
- Error messages are clear and actionable
- File paths included in errors
- Script doesn't crash on expected errors

**Dependencies**: T024 (complete script)

---

### T026: ✅ Add verbose mode logging

**File**: `scripts/i18n-check.ts`  
**Description**: Add verbose logging throughout the script when `--verbose` flag is set:

- Log to stderr (not stdout)
- Progress messages for each step
- Key counts per locale
- Source file count
- Analysis progress
- Follow format from contracts/cli-interface.md

**Acceptance**:

- Verbose output goes to stderr
- Progress messages are informative
- Only shown when --verbose flag present
- Doesn't interfere with report output

**Dependencies**: T024 (complete script)

---

## Phase 3.5: Documentation & Polish

### T027 [P]: ✅ Create Russian documentation

**File**: `docs/scripts/I18N_CHECK.md`  
**Description**: Create comprehensive Russian-language documentation following the pattern of `docs/scripts/TRANSLATE.md`:

- Назначение (Purpose)
- Предварительные требования (Prerequisites)
- Запуск (Usage)
- Опции (Options)
- Примеры (Examples)
- Вывод (Output)
- Поведение и ограничения (Behavior and limitations)
- Обработка ошибок (Error handling)
- Частые проблемы (Common issues)

**Acceptance**:

- Documentation file created
- All sections completed in Russian
- Examples are clear and accurate
- Follows existing documentation style
- Includes quickstart examples

**Dependencies**: T024 (script complete for examples)

---

### T028 [P]: ✅ Add unit tests for edge cases

**File**: `tests/scripts/i18n-check.test.ts`  
**Description**: Add additional unit tests for edge cases:

- Empty locale directories
- Files with no keys
- Very deeply nested keys (5+ levels)
- Keys with special characters
- Large files (performance)
- Unicode in keys and values

**Acceptance**:

- Edge case tests added
- All tests pass
- Code coverage improved
- No regressions

**Dependencies**: T024 (complete implementation)

---

### T029: ✅ Run ESLint and Prettier

**File**: `scripts/i18n-check.ts`, `tests/scripts/i18n-check.test.ts`  
**Description**: Run linting and formatting tools on all new files:

- `npm run lint:fix` to auto-fix issues
- `npm run format` to format code
- Ensure TypeScript types are correct
- Fix any remaining lint errors manually

**Acceptance**:

- No ESLint errors
- Code is properly formatted
- TypeScript compiles without errors
- Follows project code style

**Dependencies**: T024, T027, T028 (all files created)

---

### T030: ✅ Manual testing with quickstart scenarios

**File**: N/A (manual testing)  
**Description**: Execute all 10 quickstart scenarios from `specs/001-i18n/quickstart.md`:

1. Basic execution
2. Verbose output
3. JSON output
4. Duplicate detection
5. Unused key detection
6. Missing key detection
7. Nested key handling
8. Key usage detection
9. Error handling (invalid JSON)
10. Clean state (no issues)

**Acceptance**:

- All quickstart scenarios pass
- Script behaves as specified
- Output matches expectations
- Performance is acceptable (<5s)

**Dependencies**: T024 (complete script)

---

## Dependencies Graph

```
Setup:
  T001 (package.json) → [no deps]
  T002 (test dir) → [no deps]

Tests (can run in parallel after setup):
  T003-T011 [P] → T002

Types:
  T012 → [no deps]

Core Functions (sequential, each depends on its test + types):
  T013 → T003, T012
  T014 → T004, T012
  T015 → T005, T012, T013
  T016 → T006, T012
  T017 → T012, T016
  T018 → T007, T012
  T019 → T008, T012
  T020 → T009, T012
  T021 → T010, T012
  T022 → T012

Main:
  T023 → T011, T012-T022
  T024 → T023

Integration:
  T025 → T024
  T026 → T024

Polish (can run in parallel after T024):
  T027 [P] → T024
  T028 [P] → T024
  T029 → T024, T027, T028
  T030 → T024
```

---

## Parallel Execution Examples

### Phase 1: Setup (sequential)

```bash
# T001: Add npm script
# T002: Create test directory
```

### Phase 2: Write all tests in parallel

```bash
# After T002 completes, launch all test tasks together:
Task: "Unit test for flattenKeys in tests/scripts/i18n-check.test.ts"
Task: "Unit test for loadLocaleFiles in tests/scripts/i18n-check.test.ts"
Task: "Unit test for findDuplicateKeys in tests/scripts/i18n-check.test.ts"
Task: "Unit test for scanSourceFileForKeys in tests/scripts/i18n-check.test.ts"
Task: "Unit test for findUnusedKeys in tests/scripts/i18n-check.test.ts"
Task: "Unit test for findMissingKeys in tests/scripts/i18n-check.test.ts"
Task: "Unit test for formatTextReport in tests/scripts/i18n-check.test.ts"
Task: "Unit test for formatJsonReport in tests/scripts/i18n-check.test.ts"
Task: "Integration test for CLI execution in tests/scripts/i18n-check.test.ts"
```

### Phase 3: Implementation (sequential, TDD)

```bash
# Must be done one at a time, each after its test:
# T012: Types
# T013: Implement flattenKeys (makes T003 pass)
# T014: Implement loadLocaleFiles (makes T004 pass)
# ... and so on
```

### Phase 4: Polish (some parallel)

```bash
# After T024 completes:
Task: "Create Russian documentation in docs/scripts/I18N_CHECK.md"  # [P]
Task: "Add edge case tests in tests/scripts/i18n-check.test.ts"     # [P]

# Then sequential:
# T029: Lint and format
# T030: Manual testing
```

---

## Validation Checklist

- [x] All contracts have corresponding tests (CLI and output format tested)
- [x] All functions have unit tests (T003-T010)
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks truly independent (different test cases, documentation)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] i18n: Script enforces i18n quality, no new UI strings added
- [x] Prisma: Not applicable (no database access)
- [x] Directus: Not applicable (no CMS integration)
- [x] Partner: Not applicable (no partner flows)

---

## Notes

- **TDD Approach**: All tests (T003-T011) must be written and failing before any implementation
- **Single File**: All implementation in one file (`scripts/i18n-check.ts`) means implementation tasks are sequential
- **Test File**: All tests in one file (`tests/scripts/i18n-check.test.ts`) but different test suites can be written in parallel
- **Performance**: Target <5 seconds execution time for ~64 JSON files and ~200 source files
- **No External Dependencies**: Uses only Node.js built-ins (fs, path)
- **Exit Code**: Always 0 on successful execution, even if issues found (script reports, doesn't fail)

---

_Aligned with Constitution v1.0.0 - See `/memory/constitution.md`_
_Based on plan.md, research.md, data-model.md, contracts/, quickstart.md_
