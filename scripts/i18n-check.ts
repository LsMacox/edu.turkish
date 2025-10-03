/*
i18n Translation Keys Quality Control Script
Analyzes i18n translation files to detect duplicates, unused keys, and missing translations.
Usage: npm run i18n:check [--verbose] [--json] [--remove-unused]
*/

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

// ============================================================================
// Type Definitions (from data-model.md)
// ============================================================================

export type Locale = 'en' | 'ru' | 'kk' | 'tr'

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

type IssueType = 'duplicate' | 'unused' | 'missing' | 'empty'
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
  emptyStructureCount: number
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
  emptyStructureIssues: EmptyStructureIssue[]
  summary: ReportSummary
}

interface EmptyStructureIssue extends QualityIssue {
  type: 'empty'
  severity: 'warning'
  key: string
  locale: Locale
  filePath: string
}

interface CliOptions {
  verbose: boolean
  jsonOutput: boolean
  removeUnused: boolean
  removeEmpty: boolean
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Recursively flattens nested JSON object into dot-notation keys
 * @param obj - Object to flatten
 * @param prefix - Current key prefix
 * @returns Array of flattened keys in dot notation
 */
export function flattenKeys(obj: object, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    // If value is an object and not an array, recurse
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey))
    } else {
      // Leaf node (string, number, array, etc.)
      keys.push(fullKey)
    }
  }

  return keys
}

/**
 * Loads all JSON files from a locale directory
 * @param locale - Locale code (en, ru, kk, tr)
 * @param baseDir - Base directory (defaults to i18n/locales)
 * @returns Map of file paths to parsed JSON content
 */
export function loadLocaleFiles(locale: string, baseDir?: string): Map<string, object> {
  const localeDir = baseDir ? join(baseDir, locale) : join(process.cwd(), 'i18n/locales', locale)
  const fileMap = new Map<string, object>()

  try {
    const files = readdirSync(localeDir, { recursive: true, encoding: 'utf-8' })

    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.json')) {
        const fullPath = join(localeDir, file)
        const relativePath = relative(process.cwd(), fullPath)

        try {
          const content = readFileSync(fullPath, 'utf-8')
          const parsed = JSON.parse(content)
          fileMap.set(relativePath, parsed)
        } catch (error) {
          throw new Error(
            `Failed to parse ${relativePath}: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Locale directory not found: ${localeDir}`)
    }
    throw error
  }

  return fileMap
}

/**
 * Finds duplicate keys within a locale
 * @param locale - Locale code
 * @param fileMap - Map of file paths to parsed content
 * @returns Array of duplicate key issues
 */
export function findDuplicateKeys(
  locale: string,
  fileMap: Map<string, object>,
): DuplicateKeyIssue[] {
  const seen = new Map<string, string>() // key -> first file path
  const duplicates: DuplicateKeyIssue[] = []

  for (const [filePath, content] of fileMap.entries()) {
    const keys = flattenKeys(content)

    for (const key of keys) {
      if (seen.has(key)) {
        duplicates.push({
          type: 'duplicate',
          severity: 'error',
          key,
          locale: locale as Locale,
          firstOccurrence: seen.get(key)!,
          duplicateOccurrence: filePath,
        })
      } else {
        seen.set(key, filePath)
      }
    }
  }

  return duplicates
}

/**
 * Scans a source file for i18n key usage
 * @param filePath - Path to source file
 * @returns Set of found translation keys
 */
export function scanSourceFileForKeys(filePath: string): Set<string> {
  const keys = new Set<string>()

  try {
    const content = readFileSync(filePath, 'utf-8')

    // Regex to match t(), $t(), te(), tm() calls with string arguments
    // Matches: t('key'), $t("key"), t(`key`), te('key'), tm('key')
    const callRegex = /\b(?:t|te|tm|\$t)\s*\(\s*['"`]([^'"`]+)['"`]/g

    let match
    while ((match = callRegex.exec(content)) !== null) {
      keys.add(match[1])
    }

    // Heuristic: capture i18n keys assigned to common props (title, text, label, placeholder, ariaLabel)
    // This covers patterns like: { title: 'home.services.card1_title' } used later as $t(card.title)
    const propRegex = /\b(title|text|label|placeholder|ariaLabel|aria_label)\s*:\s*['"`]([^'"`]+)['"`]/g
    while ((match = propRegex.exec(content)) !== null) {
      const key = match[2]
      if (key.includes('.')) {
        keys.add(key)
      }
    }

    // Template literal handling for cities buttons on home page universities section
    // Pattern: t(`universities_page.filters.cities.${code}`)
    const tmplCallRegex = /\b(?:t|te|tm|\$t)\s*\(\s*`([^`]+)`/g
    while ((match = tmplCallRegex.exec(content)) !== null) {
      const tmpl = match[1]
      const prefix = 'universities_page.filters.cities.'
      if (tmpl.startsWith(prefix) && tmpl.includes('${')) {
        // Collect candidate city codes from current file
        const codes = new Set<string>()
        const codePropRegex = /\bcode\s*:\s*['"]([a-zA-Z0-9_-]+)['"]/g
        let cm
        while ((cm = codePropRegex.exec(content)) !== null) {
          codes.add(cm[1])
        }

        // Also fallback to common city names if not found explicitly
        if (codes.size === 0) {
          ;['istanbul', 'ankara', 'izmir'].forEach((c) => codes.add(c))
        }

        for (const c of codes) {
          keys.add(prefix + c)
        }
      }
    }
  } catch (error) {
    // Silently skip files that can't be read
  }

  return keys
}

/**
 * Scans all source files in the project
 * @returns Set of all used translation keys
 */
export function scanAllSourceFiles(): Set<string> {
  const allKeys = new Set<string>()
  const directories = ['app', 'server', 'components', 'pages', 'composables']
  const extensions = ['.vue', '.ts', '.js']

  for (const dir of directories) {
    const dirPath = join(process.cwd(), dir)

    try {
      const files = readdirSync(dirPath, { recursive: true, encoding: 'utf-8' })

      for (const file of files) {
        if (typeof file === 'string' && extensions.some((ext) => file.endsWith(ext))) {
          const fullPath = join(dirPath, file)
          const keys = scanSourceFileForKeys(fullPath)
          keys.forEach((key) => allKeys.add(key))
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read, skip it
    }
  }

  return allKeys
}

/**
 * Finds translation keys that are defined but never used
 * @param localeKeySets - Map of locale to key sets
 * @param usedKeys - Set of keys found in source code
 * @returns Array of unused key issues
 */
export function findUnusedKeys(
  localeKeySets: Map<string, LocaleKeySet>,
  usedKeys: Set<string>,
): UnusedKeyIssue[] {
  const unused: UnusedKeyIssue[] = []

  for (const [locale, keySet] of localeKeySets.entries()) {
    for (const key of keySet.keys) {
      if (!usedKeys.has(key)) {
        unused.push({
          type: 'unused',
          severity: 'warning',
          key,
          locale: locale as Locale,
          filePath: keySet.keyToFile.get(key) || 'unknown',
        })
      }
    }
  }

  return unused
}

/**
 * Finds keys that exist in some locales but not others
 * @param localeKeySets - Map of locale to key sets
 * @returns Array of missing key issues
 */
export function findMissingKeys(localeKeySets: Map<string, LocaleKeySet>): MissingKeyIssue[] {
  const allKeys = new Set<string>()

  // Collect all unique keys across all locales
  for (const keySet of localeKeySets.values()) {
    keySet.keys.forEach((key) => allKeys.add(key))
  }

  const missing: MissingKeyIssue[] = []

  // For each key, check which locales have it
  for (const key of allKeys) {
    const presentIn: Locale[] = []
    const missingIn: Locale[] = []

    for (const [locale, keySet] of localeKeySets.entries()) {
      if (keySet.keys.has(key)) {
        presentIn.push(locale as Locale)
      } else {
        missingIn.push(locale as Locale)
      }
    }

    // Only report if key is missing in at least one locale
    if (missingIn.length > 0) {
      missing.push({
        type: 'missing',
        severity: 'error',
        key,
        presentIn,
        missingIn,
      })
    }
  }

  return missing
}

/**
 * Formats quality report as human-readable text
 * @param report - Quality report object
 * @returns Formatted text report
 */
export function formatTextReport(report: QualityReport): string {
  const lines: string[] = []

  // Header
  lines.push('=== i18n Translation Keys Quality Report ===')
  lines.push(`Generated: ${report.timestamp.toISOString().replace('T', ' ').substring(0, 19)}`)
  lines.push(
    `Scanned: ${report.scannedLocales.length} locales, ${report.totalKeys} total keys, ${report.totalSourceFiles} source files`,
  )
  lines.push('')
  lines.push('━'.repeat(80))
  lines.push('')

  // Check if there are any issues
  if (report.summary.totalIssues === 0) {
    lines.push('✅ No issues found! All translation keys are valid and consistent.')
    lines.push('')
    lines.push('━'.repeat(80))
    return lines.join('\n')
  }

  // Duplicate keys section
  if (report.duplicateIssues.length > 0) {
    lines.push(`[DUPLICATE KEYS] (${report.duplicateIssues.length} issues)`)
    lines.push('')

    for (const issue of report.duplicateIssues) {
      lines.push(`  ❌ Key: "${issue.key}"`)
      lines.push(`     Locale: ${issue.locale}`)
      lines.push(`     First occurrence: ${issue.firstOccurrence}`)
      lines.push(`     Duplicate in: ${issue.duplicateOccurrence}`)
      lines.push('')
    }

    lines.push('━'.repeat(80))
    lines.push('')
  }

  // Unused keys section
  if (report.unusedIssues.length > 0) {
    lines.push(`[UNUSED KEYS] (${report.unusedIssues.length} issues)`)
    lines.push('')

    for (const issue of report.unusedIssues) {
      lines.push(`  ⚠️  Key: "${issue.key}"`)
      lines.push(`     Locale: ${issue.locale}`)
      lines.push(`     File: ${issue.filePath}`)
      lines.push(`     (Not found in any source file)`)
      lines.push('')
    }

    lines.push('━'.repeat(80))
    lines.push('')
  }

  // Missing keys section
  if (report.missingIssues.length > 0) {
    lines.push(`[MISSING KEYS] (${report.missingIssues.length} issues)`)
    lines.push('')

    for (const issue of report.missingIssues) {
      lines.push(`  ❌ Key: "${issue.key}"`)
      lines.push(`     Present in: ${issue.presentIn.join(', ')}`)
      lines.push(`     Missing in: ${issue.missingIn.join(', ')}`)
      lines.push('')
    }

    lines.push('━'.repeat(80))
    lines.push('')
  }

  // Empty structures section
  if (report.emptyStructureIssues.length > 0) {
    lines.push(`[EMPTY STRUCTURES] (${report.emptyStructureIssues.length} issues)`)
    lines.push('')

    for (const issue of report.emptyStructureIssues) {
      lines.push(`  ⚠️  Key: "${issue.key}"`)
      lines.push(`     Locale: ${issue.locale}`)
      lines.push(`     File: ${issue.filePath}`)
      lines.push(`     (Contains only empty objects with no values)`)
      lines.push('')
    }

    lines.push('━'.repeat(80))
    lines.push('')
  }

  // Summary
  lines.push(
    `Summary: ${report.summary.totalIssues} total issues (${report.summary.duplicateCount} duplicates, ${report.summary.unusedCount} unused, ${report.summary.missingCount} missing, ${report.summary.emptyStructureCount} empty)`,
  )

  return lines.join('\n')
}

/**
 * Formats quality report as JSON
 * @param report - Quality report object
 * @returns JSON string
 */
export function formatJsonReport(report: QualityReport): string {
  return JSON.stringify(
    {
      timestamp: report.timestamp.toISOString(),
      scannedLocales: report.scannedLocales,
      totalKeys: report.totalKeys,
      totalSourceFiles: report.totalSourceFiles,
      duplicateIssues: report.duplicateIssues,
      unusedIssues: report.unusedIssues,
      missingIssues: report.missingIssues,
      emptyStructureIssues: report.emptyStructureIssues,
      summary: report.summary,
    },
    null,
    2,
  )
}

/**
 * Checks if an object is empty or contains only empty objects recursively
 * @param obj - Object to check
 * @returns true if object is empty or contains only empty structures
 */
export function isEmptyStructure(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true
  }
  
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return false
  }
  
  const keys = Object.keys(obj)
  if (keys.length === 0) {
    return true
  }
  
  // Check if all nested values are also empty structures
  return keys.every(key => isEmptyStructure(obj[key]))
}

/**
 * Finds empty structures in translation files
 * @param locale - Locale code
 * @param fileMap - Map of file paths to parsed content
 * @returns Array of empty structure issues
 */
export function findEmptyStructures(
  locale: string,
  fileMap: Map<string, object>,
): EmptyStructureIssue[] {
  const emptyStructures: EmptyStructureIssue[] = []
  
  for (const [filePath, content] of fileMap.entries()) {
    const checkObject = (obj: any, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (isEmptyStructure(value)) {
            emptyStructures.push({
              type: 'empty',
              severity: 'warning',
              key: fullKey,
              locale: locale as Locale,
              filePath,
            })
          } else {
            checkObject(value, fullKey)
          }
        }
      }
    }
    
    checkObject(content)
  }
  
  return emptyStructures
}

/**
 * Removes empty structures from translation files
 * @param emptyIssues - Array of empty structure issues
 * @param verbose - Whether to log verbose output
 * @returns Number of empty structures removed
 */
export function removeEmptyStructures(emptyIssues: EmptyStructureIssue[], verbose: boolean): number {
  const fileChanges = new Map<string, { content: any; keysToRemove: string[] }>()
  
  // Group keys by file
  for (const issue of emptyIssues) {
    if (!fileChanges.has(issue.filePath)) {
      try {
        const content = JSON.parse(readFileSync(issue.filePath, 'utf-8'))
        fileChanges.set(issue.filePath, { content, keysToRemove: [] })
      } catch (error) {
        log(`⚠️  Could not read ${issue.filePath}, skipping`, verbose)
        continue
      }
    }
    
    const fileData = fileChanges.get(issue.filePath)!
    fileData.keysToRemove.push(issue.key)
  }
  
  let totalRemoved = 0
  
  // Process each file
  for (const [filePath, { content, keysToRemove }] of fileChanges.entries()) {
    let removedCount = 0
    
    for (const key of keysToRemove) {
      if (removeKeyFromObject(content, key)) {
        removedCount++
        log(`  ✓ Removed empty structure "${key}" from ${filePath}`, verbose)
      }
    }
    
    if (removedCount > 0) {
      // Write the modified content back to file
      writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')
      log(`✓ Updated ${filePath}: removed ${removedCount} empty structure(s)`, verbose)
      totalRemoved += removedCount
    }
  }
  
  return totalRemoved
}

/**
 * Removes a key from a nested object using dot notation
 * @param obj - Object to modify
 * @param keyPath - Dot-notation path to the key
 * @returns true if key was found and removed, false otherwise
 */
export function removeKeyFromObject(obj: any, keyPath: string): boolean {
  const parts = keyPath.split('.')
  const lastKey = parts.pop()!
  
  let current = obj
  for (const part of parts) {
    if (!(part in current)) {
      return false
    }
    current = current[part]
  }
  
  if (lastKey in current) {
    delete current[lastKey]
    
    // Clean up empty parent objects
    let parent = obj
    for (let i = 0; i < parts.length - 1; i++) {
      parent = parent[parts[i]]
    }
    
    if (parts.length > 0) {
      const parentKey = parts[parts.length - 1]
      if (parentKey && Object.keys(current).length === 0) {
        delete parent[parentKey]
      }
    }
    
    return true
  }
  
  return false
}

/**
 * Removes unused keys from translation files
 * @param unusedIssues - Array of unused key issues
 * @param verbose - Whether to log verbose output
 * @returns Number of keys removed
 */
export function removeUnusedKeys(unusedIssues: UnusedKeyIssue[], verbose: boolean): number {
  const fileChanges = new Map<string, { content: any; keysToRemove: string[] }>()
  
  // Group keys by file
  for (const issue of unusedIssues) {
    if (!fileChanges.has(issue.filePath)) {
      try {
        const content = JSON.parse(readFileSync(issue.filePath, 'utf-8'))
        fileChanges.set(issue.filePath, { content, keysToRemove: [] })
      } catch (error) {
        log(`⚠️  Could not read ${issue.filePath}, skipping`, verbose)
        continue
      }
    }
    
    const fileData = fileChanges.get(issue.filePath)!
    // Extract the key relative to the file (remove file-specific prefix if any)
    const keyParts = issue.key.split('.')
    fileData.keysToRemove.push(issue.key)
  }
  
  let totalRemoved = 0
  
  // Process each file
  for (const [filePath, { content, keysToRemove }] of fileChanges.entries()) {
    let removedCount = 0
    
    for (const key of keysToRemove) {
      // Try to find the key in the file content
      // The key might be stored with or without a prefix
      const flatKeys = flattenKeys(content)
      const matchingKey = flatKeys.find(k => k === key || key.endsWith(`.${k}`) || k.endsWith(`.${key}`))
      
      if (matchingKey && removeKeyFromObject(content, matchingKey)) {
        removedCount++
        log(`  ✓ Removed "${matchingKey}" from ${filePath}`, verbose)
      }
    }
    
    if (removedCount > 0) {
      // Write the modified content back to file
      writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')
      log(`✓ Updated ${filePath}: removed ${removedCount} key(s)`, verbose)
      totalRemoved += removedCount
    }
  }
  
  return totalRemoved
}

/**
 * Prompts user for confirmation
 * @param message - Message to display
 * @returns Promise that resolves to true if user confirms
 */
async function confirm(message: string): Promise<boolean> {
  const readline = await import('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  
  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

/**
 * Parses CLI arguments
 * @param argv - Command line arguments
 * @returns Parsed options
 */
function parseArgs(argv: string[]): CliOptions {
  return {
    verbose: argv.includes('--verbose'),
    jsonOutput: argv.includes('--json'),
    removeUnused: argv.includes('--remove-unused'),
    removeEmpty: argv.includes('--remove-empty'),
  }
}

/**
 * Logs verbose message to stderr
 * @param message - Message to log
 * @param verbose - Whether verbose mode is enabled
 */
function log(message: string, verbose: boolean): void {
  if (verbose) {
    console.error(message)
  }
}

/**
 * Main function - orchestrates the entire analysis
 */
async function main(): Promise<void> {
  try {
    // Parse CLI arguments
    const options = parseArgs(process.argv.slice(2))

    log('Loading locale files...', options.verbose)

    // Load all locale files
    const locales: Locale[] = ['en', 'ru', 'kk', 'tr']
    const localeKeySets = new Map<string, LocaleKeySet>()
    let totalKeys = 0

    for (const locale of locales) {
      try {
        const fileMap = loadLocaleFiles(locale)
        const keys = new Set<string>()
        const keyToFile = new Map<string, string>()

        for (const [filePath, content] of fileMap.entries()) {
          const fileKeys = flattenKeys(content)
          fileKeys.forEach((key) => {
            keys.add(key)
            if (!keyToFile.has(key)) {
              keyToFile.set(key, filePath)
            }
          })
        }

        localeKeySets.set(locale, { locale, keys, keyToFile })
        totalKeys += keys.size

        log(`✓ Loaded ${locale}: ${keys.size} keys from ${fileMap.size} files`, options.verbose)
      } catch (error) {
        console.error(
          `Error loading locale ${locale}: ${error instanceof Error ? error.message : String(error)}`,
        )
        process.exit(1)
      }
    }

    log('', options.verbose)
    log('Scanning source files...', options.verbose)

    // Scan all source files for key usage
    const usedKeys = scanAllSourceFiles()
    const sourceFileCount = usedKeys.size > 0 ? 1 : 0 // Simplified count

    log(`✓ Scanned source files, found ${usedKeys.size} key usages`, options.verbose)
    log('', options.verbose)

    // Analyze for issues
    log('Analyzing duplicates...', options.verbose)
    const duplicateIssues: DuplicateKeyIssue[] = []
    for (const locale of locales) {
      const fileMap = loadLocaleFiles(locale)
      const localeDuplicates = findDuplicateKeys(locale, fileMap)
      duplicateIssues.push(...localeDuplicates)
    }
    log(`✓ Found ${duplicateIssues.length} duplicate keys`, options.verbose)

    log('Analyzing unused keys...', options.verbose)
    const unusedIssues = findUnusedKeys(localeKeySets, usedKeys)
    log(`✓ Found ${unusedIssues.length} unused keys`, options.verbose)

    log('Analyzing missing keys...', options.verbose)
    const missingIssues = findMissingKeys(localeKeySets)
    log(`✓ Found ${missingIssues.length} missing keys`, options.verbose)

    log('Analyzing empty structures...', options.verbose)
    const emptyStructureIssues: EmptyStructureIssue[] = []
    for (const locale of locales) {
      const fileMap = loadLocaleFiles(locale)
      const localeEmptyStructures = findEmptyStructures(locale, fileMap)
      emptyStructureIssues.push(...localeEmptyStructures)
    }
    log(`✓ Found ${emptyStructureIssues.length} empty structures`, options.verbose)
    log('', options.verbose)

    // Build report
    const report: QualityReport = {
      timestamp: new Date(),
      scannedLocales: locales,
      totalKeys: totalKeys / locales.length, // Average keys per locale
      totalSourceFiles: sourceFileCount,
      duplicateIssues,
      unusedIssues,
      missingIssues,
      emptyStructureIssues,
      summary: {
        duplicateCount: duplicateIssues.length,
        unusedCount: unusedIssues.length,
        missingCount: missingIssues.length,
        emptyStructureCount: emptyStructureIssues.length,
        totalIssues: duplicateIssues.length + unusedIssues.length + missingIssues.length + emptyStructureIssues.length,
      },
    }

    // Output report
    log('Generating report...', options.verbose)

    if (options.jsonOutput) {
      console.log(formatJsonReport(report))
    } else {
      console.log(formatTextReport(report))
    }

    // Handle unused keys removal if requested
    if (options.removeUnused && unusedIssues.length > 0) {
      console.log('')
      console.log('━'.repeat(80))
      console.log('')
      console.log(`Found ${unusedIssues.length} unused key(s) that can be removed.`)
      console.log('')
      
      const shouldRemove = await confirm('Do you want to remove all unused keys?')
      
      if (shouldRemove) {
        log('', options.verbose)
        log('Removing unused keys...', options.verbose)
        const removedCount = removeUnusedKeys(unusedIssues, options.verbose)
        console.log('')
        console.log(`✅ Successfully removed ${removedCount} unused key(s) from translation files.`)
        console.log('')
      } else {
        console.log('')
        console.log('❌ Removal cancelled.')
        console.log('')
      }
    } else if (options.removeUnused && unusedIssues.length === 0) {
      console.log('')
      console.log('✅ No unused keys to remove.')
      console.log('')
    }

    // Handle empty structures removal if requested
    if (options.removeEmpty && emptyStructureIssues.length > 0) {
      console.log('')
      console.log('━'.repeat(80))
      console.log('')
      console.log(`Found ${emptyStructureIssues.length} empty structure(s) that can be removed.`)
      console.log('')
      
      const shouldRemove = await confirm('Do you want to remove all empty structures?')
      
      if (shouldRemove) {
        log('', options.verbose)
        log('Removing empty structures...', options.verbose)
        const removedCount = removeEmptyStructures(emptyStructureIssues, options.verbose)
        console.log('')
        console.log(`✅ Successfully removed ${removedCount} empty structure(s) from translation files.`)
        console.log('')
      } else {
        console.log('')
        console.log('❌ Removal cancelled.')
        console.log('')
      }
    } else if (options.removeEmpty && emptyStructureIssues.length === 0) {
      console.log('')
      console.log('✅ No empty structures to remove.')
      console.log('')
    }

    // Always exit with 0 (success) - we report issues, don't fail builds
    process.exit(0)
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

// Run main if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
