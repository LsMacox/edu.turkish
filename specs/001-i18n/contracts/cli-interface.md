# CLI Interface Contract

**Script**: `scripts/i18n-check.ts`  
**Execution**: `npm run i18n:check [options]` or `tsx scripts/i18n-check.ts [options]`

## Command Line Interface

### Synopsis

```bash
npm run i18n:check [--verbose] [--json]
```

### Options

#### `--verbose`

- **Type**: Flag (boolean)
- **Required**: No
- **Default**: `false`
- **Description**: Enable verbose output with detailed progress information

**Behavior**:

- When enabled: Show progress messages for each step (loading files, scanning, analyzing)
- When disabled: Show only the final report

**Example**:

```bash
npm run i18n:check --verbose
# Output:
# Loading locale files...
# ✓ Loaded en: 156 keys from 16 files
# ✓ Loaded ru: 158 keys from 16 files
# ✓ Loaded kk: 152 keys from 16 files
# ✓ Loaded tr: 148 keys from 16 files
# Scanning source files...
# ✓ Scanned 187 files
# Analyzing duplicates...
# Analyzing unused keys...
# Analyzing missing keys...
# === Report ===
```

---

#### `--json`

- **Type**: Flag (boolean)
- **Required**: No
- **Default**: `false`
- **Description**: Output report in JSON format instead of human-readable text

**Behavior**:

- When enabled: Output valid JSON to stdout (suitable for piping to jq or other tools)
- When disabled: Output formatted text report

**Example**:

```bash
npm run i18n:check --json > report.json
```

**JSON Output Schema**: See `output-format.md`

---

### Exit Codes

| Code | Meaning         | Description                                                             |
| ---- | --------------- | ----------------------------------------------------------------------- |
| 0    | Success         | Script executed successfully (issues may or may not be found)           |
| 1    | Execution Error | Script failed due to invalid JSON, missing directories, or other errors |

**Important**: Exit code 0 does NOT mean "no issues found". It means "script ran successfully". The script's purpose is to report issues, not to fail builds.

---

### Standard Output (stdout)

**Text Mode** (default):

- Human-readable report with sections for each issue type
- Color-coded (if terminal supports it)
- File paths and line numbers for each issue

**JSON Mode** (`--json`):

- Valid JSON object conforming to `QualityReport` schema
- No color codes or formatting
- Suitable for programmatic consumption

---

### Standard Error (stderr)

Used for:

- Progress messages (in `--verbose` mode)
- Error messages (invalid JSON, missing files, etc.)
- Warnings (empty locales, etc.)

---

### Environment Variables

None required. The script operates on the current working directory and expects:

- `i18n/locales/{en,ru,kk,tr}/` directories to exist
- Source code in `app/`, `server/`, `components/`, `pages/`, `composables/` directories

---

### Working Directory

The script must be executed from the repository root:

```bash
cd /path/to/edu.turkish
npm run i18n:check
```

If executed from a subdirectory, the script will fail with an error.

---

## Usage Examples

### Basic usage

```bash
npm run i18n:check
```

### Verbose output

```bash
npm run i18n:check --verbose
```

### JSON output for LLM processing

```bash
npm run i18n:check --json | jq '.missingIssues'
```

### Save report to file

```bash
npm run i18n:check > i18n-report.txt
```

### Check exit code

```bash
npm run i18n:check
if [ $? -eq 0 ]; then
  echo "Script ran successfully"
else
  echo "Script failed"
fi
```

---

## Error Scenarios

### Invalid JSON in translation file

```
Error: Failed to parse i18n/locales/ru/pages/blog.json
  Unexpected token } in JSON at position 234
Exit code: 1
```

### Missing locale directory

```
Error: Locale directory not found: i18n/locales/tr
  Ensure all locale directories exist: en, ru, kk, tr
Exit code: 1
```

### Not executed from repo root

```
Error: i18n/locales directory not found
  Please run this script from the repository root
Exit code: 1
```

---

## Contract Tests

The following behaviors must be tested:

1. **Exit code 0 when no issues found**
   - Given: Valid translation files with no issues
   - When: Script is executed
   - Then: Exit code is 0 and report shows "No issues found"

2. **Exit code 0 when issues found**
   - Given: Translation files with duplicate keys
   - When: Script is executed
   - Then: Exit code is 0 and report shows duplicate issues

3. **Exit code 1 on invalid JSON**
   - Given: Translation file with syntax error
   - When: Script is executed
   - Then: Exit code is 1 and error message is shown

4. **JSON output is valid**
   - Given: Any translation files
   - When: Script is executed with `--json`
   - Then: Output is valid JSON conforming to schema

5. **Verbose mode shows progress**
   - Given: Any translation files
   - When: Script is executed with `--verbose`
   - Then: Progress messages are shown on stderr

---

## Integration with package.json

Add to `scripts` section:

```json
{
  "scripts": {
    "i18n:check": "tsx scripts/i18n-check.ts"
  }
}
```

This follows the existing pattern:

- `"translate": "tsx scripts/translate.ts"`
- `"import:university": "tsx scripts/import-university.ts"`
