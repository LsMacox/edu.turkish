# Quickstart: i18n Translation Keys Quality Control

**Feature**: 001-i18n  
**Purpose**: Verify the i18n quality control script works correctly

## Prerequisites

- Repository cloned and dependencies installed (`npm install`)
- Translation files exist in `i18n/locales/{en,ru,kk,tr}/`
- Source code exists in `app/`, `server/`, `components/`, `pages/`, `composables/`

## Quick Verification Steps

### 1. Run the script (basic)

```bash
npm run i18n:check
```

**Expected outcome**:

- Script executes without errors
- Report is displayed showing any issues found
- Exit code is 0

**Success criteria**:

- No execution errors (invalid JSON, missing directories)
- Report format matches specification
- All three issue types are checked (duplicates, unused, missing)

---

### 2. Run with verbose output

```bash
npm run i18n:check --verbose
```

**Expected outcome**:

- Progress messages shown on stderr
- Report shown on stdout
- Clear indication of each processing step

**Success criteria**:

- Progress messages include: "Loading locale files", "Scanning source files", "Analyzing..."
- Each locale shows key count
- Source file count is displayed

---

### 3. Run with JSON output

```bash
npm run i18n:check --json | jq '.'
```

**Expected outcome**:

- Valid JSON output
- Can be parsed by `jq`
- Contains all required fields

**Success criteria**:

- Output is valid JSON
- Contains: `timestamp`, `scannedLocales`, `totalKeys`, `totalSourceFiles`, `duplicateIssues`, `unusedIssues`, `missingIssues`, `summary`
- All arrays are present (may be empty)

---

### 4. Test duplicate detection

**Setup**: Create a test duplicate

```bash
# Add duplicate key to test file
echo '{ "test.duplicate": "value" }' > i18n/locales/en/test-dup.json
echo '{ "test.duplicate": "value2" }' > i18n/locales/en/test-dup2.json
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Report shows duplicate key issue
- Both file paths are listed
- Locale is correctly identified as "en"

**Cleanup**:

```bash
rm i18n/locales/en/test-dup.json i18n/locales/en/test-dup2.json
```

**Success criteria**:

- Duplicate is detected
- Both occurrences are reported with file paths
- Issue type is "duplicate" with severity "error"

---

### 5. Test unused key detection

**Setup**: Create an unused key

```bash
echo '{ "test.unused": "This key is not used anywhere" }' > i18n/locales/en/test-unused.json
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Report shows unused key issue
- File path is listed
- Key is marked as not found in source files

**Cleanup**:

```bash
rm i18n/locales/en/test-unused.json
```

**Success criteria**:

- Unused key is detected
- File path is correct
- Issue type is "unused" with severity "warning"

---

### 6. Test missing key detection

**Setup**: Create a key in only one locale

```bash
echo '{ "test.missing": "Only in English" }' > i18n/locales/en/test-missing.json
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Report shows missing key issue
- Shows "Present in: en"
- Shows "Missing in: ru, kk, tr"

**Cleanup**:

```bash
rm i18n/locales/en/test-missing.json
```

**Success criteria**:

- Missing key is detected
- Present/missing locales are correctly identified
- Issue type is "missing" with severity "error"

---

### 7. Test nested key handling

**Setup**: Create nested keys

```bash
cat > i18n/locales/en/test-nested.json << 'EOF'
{
  "test": {
    "nested": {
      "deep": {
        "key": "value"
      }
    }
  }
}
EOF
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Key is flattened to "test.nested.deep.key"
- Reported as missing in other locales
- Nested structure is correctly parsed

**Cleanup**:

```bash
rm i18n/locales/en/test-nested.json
```

**Success criteria**:

- Nested keys are flattened to dot notation
- Deep nesting (3+ levels) is handled
- Keys are correctly compared across locales

---

### 8. Test key usage detection

**Setup**: Create a key and use it in source code

```bash
# Add key
echo '{ "test.used": "This key is used" }' > i18n/locales/en/test-used.json

# Create source file that uses it
cat > app/test-component.vue << 'EOF'
<template>
  <div>{{ $t('test.used') }}</div>
</template>
EOF
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Key is NOT reported as unused
- Key is detected in source file
- Missing key issues for other locales (ru, kk, tr)

**Cleanup**:

```bash
rm i18n/locales/en/test-used.json
rm app/test-component.vue
```

**Success criteria**:

- Used key is not in unused list
- Usage detection works with `$t()` syntax
- Source file scanning is functional

---

### 9. Test error handling (invalid JSON)

**Setup**: Create invalid JSON file

```bash
echo '{ "invalid": json }' > i18n/locales/en/test-invalid.json
```

**Run**:

```bash
npm run i18n:check
```

**Expected outcome**:

- Script exits with code 1
- Error message shows file path
- Error message indicates JSON parse failure

**Cleanup**:

```bash
rm i18n/locales/en/test-invalid.json
```

**Success criteria**:

- Exit code is 1 (not 0)
- Error message is clear and actionable
- File path is included in error

---

### 10. Test clean state (no issues)

**Prerequisites**: Ensure no test files remain

**Run**:

```bash
npm run i18n:check
```

**Expected outcome** (if codebase is clean):

- Report shows "No issues found"
- Exit code is 0
- Summary shows 0 for all issue counts

**Success criteria**:

- Script completes successfully
- Clear success message
- No false positives

---

## Integration Test Scenario

**Full workflow test**: Simulate a developer fixing issues

1. **Run initial check**:

   ```bash
   npm run i18n:check --json > report-before.json
   ```

2. **Review issues**:

   ```bash
   jq '.summary' report-before.json
   ```

3. **Fix a duplicate** (manual or via LLM):
   - Identify duplicate from report
   - Remove from one file
   - Keep in the other

4. **Fix a missing key** (manual or via LLM):
   - Identify missing key from report
   - Add to missing locales

5. **Remove unused key** (manual or via LLM):
   - Identify unused key from report
   - Remove from all locales

6. **Run check again**:

   ```bash
   npm run i18n:check --json > report-after.json
   ```

7. **Compare**:
   ```bash
   jq '.summary' report-after.json
   # Should show fewer issues
   ```

**Success criteria**:

- Issue count decreases after fixes
- Fixed issues no longer appear in report
- Script is useful for iterative cleanup

---

## Performance Verification

**Test**: Measure execution time

```bash
time npm run i18n:check
```

**Expected outcome**:

- Execution completes in <5 seconds
- No memory issues
- Handles ~64 JSON files and ~200 source files efficiently

**Success criteria**:

- Total time < 5 seconds
- No out-of-memory errors
- Scales reasonably with file count

---

## Acceptance Criteria

All quickstart steps must pass for the feature to be considered complete:

- ✅ Basic execution works without errors
- ✅ Verbose mode shows progress
- ✅ JSON output is valid and parseable
- ✅ Duplicate detection works
- ✅ Unused key detection works
- ✅ Missing key detection works
- ✅ Nested keys are handled correctly
- ✅ Key usage detection works
- ✅ Error handling works (invalid JSON)
- ✅ Clean state shows success
- ✅ Performance is acceptable (<5s)

---

## Troubleshooting

### Script not found

```bash
npm run i18n:check
# Error: Missing script: "i18n:check"
```

**Fix**: Ensure `package.json` has the script entry:

```json
"i18n:check": "tsx scripts/i18n-check.ts"
```

### Invalid JSON error

```
Error: Failed to parse i18n/locales/ru/common.json
```

**Fix**: Validate JSON syntax in the reported file using `jq`:

```bash
jq '.' i18n/locales/ru/common.json
```

### Missing directory error

```
Error: Locale directory not found: i18n/locales/tr
```

**Fix**: Ensure all locale directories exist:

```bash
mkdir -p i18n/locales/{en,ru,kk,tr}
```

### No source files scanned

```
Scanned 0 files
```

**Fix**: Ensure you're running from repository root:

```bash
cd /path/to/edu.turkish
npm run i18n:check
```

---

## Next Steps

After quickstart verification:

1. Run on actual codebase to find real issues
2. Use output to guide cleanup efforts
3. Integrate into development workflow
4. Consider adding to pre-commit hooks (optional)
5. Document findings in team wiki
