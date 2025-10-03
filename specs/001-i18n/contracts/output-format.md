# Output Format Contract

**Script**: `scripts/i18n-check.ts`

## Text Output Format (Default)

### Structure

The text output consists of:

1. Header with summary statistics
2. Three sections for each issue type (if issues exist)
3. Footer with overall status

### Example Output (with issues)

```
=== i18n Translation Keys Quality Report ===
Generated: 2025-10-03 00:16:28
Scanned: 4 locales, 342 total keys, 187 source files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[DUPLICATE KEYS] (2 issues)

  ❌ Key: "common.submit"
     Locale: ru
     First occurrence: i18n/locales/ru/common.json
     Duplicate in: i18n/locales/ru/components/forms.json

  ❌ Key: "pages.blog.title"
     Locale: en
     First occurrence: i18n/locales/en/pages/blog.json
     Duplicate in: i18n/locales/en/pages/articles.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[UNUSED KEYS] (3 issues)

  ⚠️  Key: "pages.old_feature.title"
     Locale: en
     File: i18n/locales/en/pages/old_feature.json
     (Not found in any source file)

  ⚠️  Key: "pages.old_feature.description"
     Locale: ru
     File: i18n/locales/ru/pages/old_feature.json
     (Not found in any source file)

  ⚠️  Key: "components.deprecated.label"
     Locale: kk
     File: i18n/locales/kk/components/deprecated.json
     (Not found in any source file)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[MISSING KEYS] (2 issues)

  ❌ Key: "pages.new_feature.cta"
     Present in: en, ru, kk
     Missing in: tr

  ❌ Key: "components.modal.confirm"
     Present in: en, ru
     Missing in: kk, tr

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary: 7 total issues (2 duplicates, 3 unused, 2 missing)
```

### Example Output (no issues)

```
=== i18n Translation Keys Quality Report ===
Generated: 2025-10-03 00:16:28
Scanned: 4 locales, 342 total keys, 187 source files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ No issues found! All translation keys are valid and consistent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## JSON Output Format (`--json`)

### Schema

```typescript
interface QualityReport {
  timestamp: string // ISO 8601 format
  scannedLocales: string[] // ["en", "ru", "kk", "tr"]
  totalKeys: number // Total unique keys across all locales
  totalSourceFiles: number // Number of source files scanned
  duplicateIssues: DuplicateKeyIssue[]
  unusedIssues: UnusedKeyIssue[]
  missingIssues: MissingKeyIssue[]
  summary: {
    duplicateCount: number
    unusedCount: number
    missingCount: number
    totalIssues: number
  }
}

interface DuplicateKeyIssue {
  type: 'duplicate'
  severity: 'error'
  key: string
  locale: string
  firstOccurrence: string
  duplicateOccurrence: string
}

interface UnusedKeyIssue {
  type: 'unused'
  severity: 'warning'
  key: string
  locale: string
  filePath: string
}

interface MissingKeyIssue {
  type: 'missing'
  severity: 'error'
  key: string
  presentIn: string[]
  missingIn: string[]
}
```

### Example JSON Output

```json
{
  "timestamp": "2025-10-03T00:16:28.123Z",
  "scannedLocales": ["en", "ru", "kk", "tr"],
  "totalKeys": 342,
  "totalSourceFiles": 187,
  "duplicateIssues": [
    {
      "type": "duplicate",
      "severity": "error",
      "key": "common.submit",
      "locale": "ru",
      "firstOccurrence": "i18n/locales/ru/common.json",
      "duplicateOccurrence": "i18n/locales/ru/components/forms.json"
    }
  ],
  "unusedIssues": [
    {
      "type": "unused",
      "severity": "warning",
      "key": "pages.old_feature.title",
      "locale": "en",
      "filePath": "i18n/locales/en/pages/old_feature.json"
    }
  ],
  "missingIssues": [
    {
      "type": "missing",
      "severity": "error",
      "key": "pages.new_feature.cta",
      "presentIn": ["en", "ru", "kk"],
      "missingIn": ["tr"]
    }
  ],
  "summary": {
    "duplicateCount": 1,
    "unusedCount": 1,
    "missingCount": 1,
    "totalIssues": 3
  }
}
```

---

## Verbose Output (stderr)

When `--verbose` flag is used, progress messages are written to stderr:

```
Loading locale files...
✓ Loaded en: 156 keys from 16 files
✓ Loaded ru: 158 keys from 16 files
✓ Loaded kk: 152 keys from 16 files
✓ Loaded tr: 148 keys from 16 files

Scanning source files...
  Scanning app/...
  Scanning server/...
  Scanning components/...
  Scanning pages/...
  Scanning composables/...
✓ Scanned 187 files, found 298 key usages

Analyzing duplicates...
✓ Found 2 duplicate keys

Analyzing unused keys...
✓ Found 3 unused keys

Analyzing missing keys...
✓ Found 2 missing keys

Generating report...
```

---

## LLM-Friendly Output Characteristics

The output format is designed for LLM consumption:

1. **Clear Structure**: Sections are clearly delimited and labeled
2. **File Paths**: Every issue includes the exact file path for automated fixes
3. **Actionable**: Each issue type has clear resolution steps
4. **Parseable**: Both text and JSON formats are easy to parse
5. **Context**: Includes locale information and related files

### LLM Usage Example

An LLM can parse the output and generate fixes:

```
Input: "Fix all duplicate keys in the i18n report"

LLM reads report:
- Duplicate: "common.submit" in ru (common.json and components/forms.json)

LLM action:
1. Read both files
2. Compare values
3. Remove duplicate from one file
4. Update references if needed
```

---

## Contract Tests

The following output behaviors must be tested:

1. **Text output format is consistent**
   - Given: Any issues
   - When: Script outputs text report
   - Then: Format matches the template above

2. **JSON output is valid and parseable**
   - Given: Any issues
   - When: Script outputs with `--json`
   - Then: Output is valid JSON and matches schema

3. **Empty report shows success message**
   - Given: No issues found
   - When: Script outputs report
   - Then: Shows "No issues found" message

4. **All file paths are relative to repo root**
   - Given: Any issues
   - When: Script outputs report
   - Then: All paths start with `i18n/`, `app/`, etc. (not absolute)

5. **Verbose output goes to stderr**
   - Given: `--verbose` flag
   - When: Script runs
   - Then: Progress messages on stderr, report on stdout

6. **Summary counts match issue arrays**
   - Given: Any issues
   - When: Report is generated
   - Then: `summary.duplicateCount` equals `duplicateIssues.length`, etc.

---

## Color Support

Text output should support terminal colors when available:

- ❌ Red for errors (duplicates, missing keys)
- ⚠️ Yellow for warnings (unused keys)
- ✅ Green for success messages
- Gray for file paths

Colors should be disabled when:

- Output is piped (`!process.stdout.isTTY`)
- `NO_COLOR` environment variable is set
- `--json` flag is used

---

## File Path Format

All file paths in the output must be:

- **Relative** to repository root
- **Forward slashes** (even on Windows)
- **Consistent** across all issue types

Examples:

- ✅ `i18n/locales/ru/common.json`
- ✅ `app/pages/blog.vue`
- ❌ `/home/user/project/i18n/locales/ru/common.json` (absolute)
- ❌ `i18n\locales\ru\common.json` (backslashes)
