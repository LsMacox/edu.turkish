#!/usr/bin/env npx tsx
/**
 * I18n Key Analyzer Script
 *
 * This script performs two main functions:
 * 1. Finds unused i18n keys from the schema that are not used in the codebase
 * 2. Checks locale JSON files for consistency with the schema (missing/extra keys)
 *
 * Usage:
 *   npx tsx scripts/check-i18n.ts [--unused] [--consistency] [--all] [--json] [--remove]
 *
 * Options:
 *   --unused      Check for unused keys in the codebase
 *   --consistency Check locale files for schema consistency
 *   --all         Run all checks (default if no options specified)
 *   --json        Output unused keys as JSON array
 *   --remove      Remove unused keys from all locale files
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const LOCALES_DIR = path.join(ROOT_DIR, 'i18n/locales')
const _SCHEMAS_DIR = path.join(ROOT_DIR, 'lib/i18n/schemas')

// Directories to search for key usage
const SEARCH_DIRS = ['app', 'server', 'lib', 'config']

// File extensions to search
const SEARCH_EXTENSIONS = ['.vue', '.ts', '.tsx', '.js', '.jsx']

// Files/patterns to exclude from search
const EXCLUDE_PATTERNS = [
    'node_modules',
    '.nuxt',
    'dist',
    'lib/i18n/schemas', // Exclude schema definitions themselves
    'scripts/check-i18n.ts',
]

// Locale file to schema namespace mapping
const LOCALE_FILE_TO_SCHEMA: Record<string, { namespace?: string; extends?: boolean }> = {
    'common.json': { extends: true }, // CommonSchema extends at root level
    'components.json': { extends: true }, // ComponentsSchema extends at root level
    'home.json': { namespace: 'home' },
    'about.json': { namespace: 'about' },
    'universities.json': { namespace: 'universities' },
    'blog.json': { namespace: 'blog' },
    'programs.json': { namespace: 'programs' },
    'reviews.json': { namespace: 'reviews' },
    'services.json': { namespace: 'services' },
    'faq.json': { namespace: 'faq' },
    'contract.json': { namespace: 'contract' },
    'privacy.json': { namespace: 'privacy' },
}

interface _KeyInfo {
    key: string
    file: string
    namespace?: string
}

interface LocaleDiscrepancy {
    locale: string
    file: string
    missingKeys: string[]
    extraKeys: string[]
}

interface UsageResult {
    key: string
    used: boolean
    usageCount: number
}

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
}

function log(message: string, color?: keyof typeof colors) {
    if (color) {
        console.log(`${colors[color]}${message}${colors.reset}`)
    } else {
        console.log(message)
    }
}

function logHeader(title: string) {
    console.log()
    log('═'.repeat(60), 'cyan')
    log(`  ${title}`, 'bold')
    log('═'.repeat(60), 'cyan')
    console.log()
}

function logSubHeader(title: string) {
    console.log()
    log(`── ${title} ──`, 'yellow')
}

/**
 * Recursively extracts all dot-notation keys from a JSON object
 */
function extractKeysFromObject(obj: unknown, prefix = ''): string[] {
    const keys: string[] = []

    if (obj === null || obj === undefined) {
        return keys
    }

    if (typeof obj !== 'object') {
        // Leaf node - this is a translation value
        if (prefix) {
            keys.push(prefix)
        }
        return keys
    }

    if (Array.isArray(obj)) {
        // For arrays, we add the array path itself as a key
        // since arrays in i18n are typically used as-is
        if (prefix) {
            keys.push(prefix)
        }
        return keys
    }

    for (const [key, value] of Object.entries(obj)) {
        const newPrefix = prefix ? `${prefix}.${key}` : key
        keys.push(...extractKeysFromObject(value, newPrefix))
    }

    return keys
}

/**
 * Loads all locale JSON files and extracts their keys
 */
function loadLocaleKeys(): Map<string, Map<string, string[]>> {
    const localeKeys = new Map<string, Map<string, string[]>>()

    const locales = fs.readdirSync(LOCALES_DIR).filter((dir) => {
        const stat = fs.statSync(path.join(LOCALES_DIR, dir))
        return stat.isDirectory()
    })

    for (const locale of locales) {
        const localeDir = path.join(LOCALES_DIR, locale)
        const fileKeys = new Map<string, string[]>()

        const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'))

        for (const file of files) {
            const filePath = path.join(localeDir, file)
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            const keys = extractKeysFromObject(content)
            fileKeys.set(file, keys)
        }

        localeKeys.set(locale, fileKeys)
    }

    return localeKeys
}

/**
 * Gets all possible i18n key paths that could be used in the codebase
 * Based on the locale JSON structure
 */
function getAllI18nKeyPaths(localeKeys: Map<string, Map<string, string[]>>): Set<string> {
    const allKeys = new Set<string>()

    // Use 'en' as the reference locale
    const enKeys = localeKeys.get('en')
    if (!enKeys) {
        throw new Error('English locale not found')
    }

    for (const [file, keys] of enKeys) {
        const config = LOCALE_FILE_TO_SCHEMA[file]
        if (!config) continue

        for (const key of keys) {
            // Keys are already fully qualified in the JSON files
            // (e.g., home.json contains { "home": { "hero": ... } } so keys are "home.hero.title")
            allKeys.add(key)
        }
    }

    return allKeys
}

/**
 * Searches for key usage in the codebase using grep
 */
function _searchKeyUsage(key: string): number {
    const searchDirs = SEARCH_DIRS.map((d) => path.join(ROOT_DIR, d)).filter((d) =>
        fs.existsSync(d)
    )

    if (searchDirs.length === 0) {
        return 0
    }

    const excludeArgs = EXCLUDE_PATTERNS.map((p) => `--exclude-dir="${p}"`).join(' ')
    const includeArgs = SEARCH_EXTENSIONS.map((ext) => `--include="*${ext}"`).join(' ')

    // Escape special regex characters in the key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Search for various patterns the key might appear in:
    // - t('key') or t("key")
    // - $t('key') or $t("key")
    // - key('key') or key("key")
    // - 'key' or "key" (as string literal)
    const patterns = [
        `['"\`]${escapedKey}['"\`]`, // Direct string usage
    ]

    let totalCount = 0

    for (const pattern of patterns) {
        try {
            const cmd = `grep -rE ${includeArgs} ${excludeArgs} "${pattern}" ${searchDirs.join(' ')} 2>/dev/null | wc -l`
            const result = execSync(cmd, { encoding: 'utf-8' }).trim()
            totalCount += parseInt(result, 10) || 0
        } catch {
            // grep returns non-zero if no matches found
        }
    }

    return totalCount
}

/**
 * Reads all source files and returns combined content
 */
function readAllSourceFiles(): string[] {
    const allContent: string[] = []

    const searchDirs = SEARCH_DIRS.map((d) => path.join(ROOT_DIR, d)).filter((d) =>
        fs.existsSync(d)
    )

    function readFilesRecursively(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.relative(ROOT_DIR, fullPath)

            // Check exclusions
            if (EXCLUDE_PATTERNS.some((p) => relativePath.includes(p))) {
                continue
            }

            if (entry.isDirectory()) {
                readFilesRecursively(fullPath)
            } else if (SEARCH_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
                try {
                    allContent.push(fs.readFileSync(fullPath, 'utf-8'))
                } catch {
                    // Skip unreadable files
                }
            }
        }
    }

    for (const dir of searchDirs) {
        readFilesRecursively(dir)
    }

    return allContent
}

/**
 * Extracts all namespace declarations and their usages from a single file
 * Pattern: const heroNs = namespace('about.hero')
 * Usage: t(heroNs('title')) -> about.hero.title
 */
function extractNamespaceUsagesFromFile(content: string): Set<string> {
    const usedKeys = new Set<string>()

    // Find all namespace declarations: const varName = namespace('prefix')
    const namespaceDeclarations = new Map<string, string>()
    const nsPattern = /(?:const|let|var)\s+(\w+)\s*=\s*namespace\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g
    let match

    while ((match = nsPattern.exec(content)) !== null) {
        const varName = match[1]
        const prefix = match[2]
        if (varName && prefix) {
            namespaceDeclarations.set(varName, prefix)
        }
    }

    // Find usages of each namespace variable: varName('key') or varName('key.subkey')
    for (const [varName, prefix] of namespaceDeclarations) {
        const usagePattern = new RegExp(`${varName}\\s*\\(\\s*['"\`]([^'"\`]+)['"\`]\\s*\\)`, 'g')
        while ((match = usagePattern.exec(content)) !== null) {
            const suffix = match[1]
            if (suffix) {
                const fullKey = `${prefix}.${suffix}`
                usedKeys.add(fullKey)
            }
        }
    }

    return usedKeys
}

/**
 * Extracts namespace usages from all source files
 */
function extractNamespaceUsages(files: string[]): Set<string> {
    const allUsedKeys = new Set<string>()

    for (const content of files) {
        const fileKeys = extractNamespaceUsagesFromFile(content)
        for (const key of fileKeys) {
            allUsedKeys.add(key)
        }
    }

    return allUsedKeys
}

/**
 * Extracts direct key usages from source code
 * Pattern: t('full.key.path') or $t('full.key.path') or key('full.key.path')
 */
function extractDirectKeyUsages(content: string): Set<string> {
    const usedKeys = new Set<string>()

    // Match t('key'), $t('key'), key('key'), etc.
    const patterns = [
        /\bt\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
        /\$t\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
        /\bkey\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
        /\btm\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
        /\bte\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]/g,
    ]

    for (const pattern of patterns) {
        let match
        while ((match = pattern.exec(content)) !== null) {
            const key = match[1]
            // Add any valid i18n key (with or without dots)
            // Keys without dots are valid top-level keys like 'loading', 'back_to_home'
            if (key) {
                usedKeys.add(key)
            }
        }
    }

    return usedKeys
}

/**
 * Batch search for multiple keys using smart detection
 * Returns both usage map and all detected keys from code
 */
function batchSearchKeyUsageWithDetails(keys: string[]): {
    usageMap: Map<string, number>
    detectedKeys: Set<string>
} {
    const results = new Map<string, number>()

    // Initialize all keys with 0
    for (const key of keys) {
        results.set(key, 0)
    }

    const allContent = readAllSourceFiles()
    const combinedContent = allContent.join('\n')

    // Extract all used keys from namespace patterns and direct usages
    const namespaceUsages = extractNamespaceUsages(allContent)
    const directUsages = extractDirectKeyUsages(combinedContent)

    // Combine all usages
    const allUsedKeys = new Set([...namespaceUsages, ...directUsages])

    // Also search for literal string matches (for keys used in other ways)
    for (const key of keys) {
        let count = 0

        // Check if found via namespace or direct usage
        if (allUsedKeys.has(key)) {
            count++
        }

        // Also check for literal string occurrence (backup)
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const literalPattern = new RegExp(`['"\`]${escapedKey}['"\`]`, 'g')
        const matches = combinedContent.match(literalPattern)
        if (matches) {
            count += matches.length
        }

        results.set(key, count)
    }

    return { usageMap: results, detectedKeys: allUsedKeys }
}

/**
 * Checks for unused i18n keys
 */
function checkUnusedKeys(localeKeys: Map<string, Map<string, string[]>>): UsageResult[] {
    log('Analyzing key usage in codebase...', 'cyan')

    const allKeys = getAllI18nKeyPaths(localeKeys)
    const keyArray = Array.from(allKeys)

    log(`Found ${keyArray.length} unique i18n keys in locale files`, 'dim')

    const { usageMap, detectedKeys } = batchSearchKeyUsageWithDetails(keyArray)

    // Find keys used in code but not in locale files (potential typos or missing translations)
    const keysInCodeNotInLocale = Array.from(detectedKeys).filter((k) => !allKeys.has(k))
    if (keysInCodeNotInLocale.length > 0) {
        console.log()
        log(`⚠️  Found ${keysInCodeNotInLocale.length} keys used in code but NOT in locale files:`, 'yellow')
        for (const k of keysInCodeNotInLocale.slice(0, 30).sort()) {
            log(`  • ${k}`, 'yellow')
        }
        if (keysInCodeNotInLocale.length > 30) {
            log(`  ... and ${keysInCodeNotInLocale.length - 30} more`, 'dim')
        }
        console.log()
    }

    const results: UsageResult[] = []

    for (const key of keyArray) {
        const count = usageMap.get(key) || 0
        results.push({
            key,
            used: count > 0,
            usageCount: count,
        })
    }

    return results
}

/**
 * Compares locale files across all locales for consistency
 */
function checkLocaleConsistency(
    localeKeys: Map<string, Map<string, string[]>>
): LocaleDiscrepancy[] {
    const discrepancies: LocaleDiscrepancy[] = []

    // Use 'en' as the reference locale
    const referenceLocale = 'en'
    const referenceKeys = localeKeys.get(referenceLocale)

    if (!referenceKeys) {
        throw new Error(`Reference locale '${referenceLocale}' not found`)
    }

    for (const [locale, fileKeys] of localeKeys) {
        if (locale === referenceLocale) continue

        for (const [file, refKeys] of referenceKeys) {
            const localeFileKeys = fileKeys.get(file) || []

            const refKeySet = new Set(refKeys)
            const localeKeySet = new Set(localeFileKeys)

            const missingKeys = refKeys.filter((k) => !localeKeySet.has(k))
            const extraKeys = localeFileKeys.filter((k) => !refKeySet.has(k))

            if (missingKeys.length > 0 || extraKeys.length > 0) {
                discrepancies.push({
                    locale,
                    file,
                    missingKeys,
                    extraKeys,
                })
            }
        }

        // Check for files that exist in locale but not in reference
        for (const [file] of fileKeys) {
            if (!referenceKeys.has(file)) {
                discrepancies.push({
                    locale,
                    file,
                    missingKeys: [],
                    extraKeys: [`[Entire file '${file}' not in reference locale]`],
                })
            }
        }
    }

    return discrepancies
}

/**
 * Removes a key from a nested object using dot notation path
 */
function removeKeyFromObject(obj: Record<string, unknown>, keyPath: string): boolean {
    const parts = keyPath.split('.')
    let current: Record<string, unknown> = obj

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!part || typeof current[part] !== 'object' || current[part] === null) {
            return false
        }
        current = current[part] as Record<string, unknown>
    }

    const lastPart = parts[parts.length - 1]
    if (lastPart && lastPart in current) {
        delete current[lastPart]
        return true
    }
    return false
}

/**
 * Recursively removes empty objects from a nested structure
 */
function removeEmptyObjects(obj: Record<string, unknown>): void {
    for (const key of Object.keys(obj)) {
        const value = obj[key]
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            removeEmptyObjects(value as Record<string, unknown>)
            if (Object.keys(value as Record<string, unknown>).length === 0) {
                delete obj[key]
            }
        }
    }
}

/**
 * Removes unused keys from all locale files
 */
function removeUnusedKeys(unusedKeys: string[]): void {
    const locales = fs.readdirSync(LOCALES_DIR).filter((dir) => {
        const stat = fs.statSync(path.join(LOCALES_DIR, dir))
        return stat.isDirectory()
    })

    let totalRemoved = 0

    for (const locale of locales) {
        const localeDir = path.join(LOCALES_DIR, locale)
        const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'))

        for (const file of files) {
            const filePath = path.join(localeDir, file)
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
            let removedCount = 0

            for (const key of unusedKeys) {
                if (removeKeyFromObject(content, key)) {
                    removedCount++
                }
            }

            if (removedCount > 0) {
                removeEmptyObjects(content)
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')
                log(`  ${locale}/${file}: removed ${removedCount} keys`, 'green')
                totalRemoved += removedCount
            }
        }
    }

    log(`\n✅ Total removed: ${totalRemoved} key occurrences across all locales`, 'green')
}

/**
 * Removes extra keys from locale files based on discrepancies
 */
function removeExtraKeys(discrepancies: LocaleDiscrepancy[]): void {
    let totalRemoved = 0

    for (const d of discrepancies) {
        if (d.extraKeys.length === 0) continue
        // Skip meta messages like "[Entire file 'x' not in reference locale]"
        const realExtraKeys = d.extraKeys.filter((k) => !k.startsWith('['))
        if (realExtraKeys.length === 0) continue

        const filePath = path.join(LOCALES_DIR, d.locale, d.file)
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        let removedCount = 0

        for (const key of realExtraKeys) {
            if (removeKeyFromObject(content, key)) {
                removedCount++
            }
        }

        if (removedCount > 0) {
            removeEmptyObjects(content)
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')
            log(`  ${d.locale}/${d.file}: removed ${removedCount} extra keys`, 'green')
            totalRemoved += removedCount
        }
    }

    log(`\n✅ Total removed: ${totalRemoved} extra keys`, 'green')
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2)

    const checkUnused = args.includes('--unused') || args.includes('--all') || args.length === 0
    const checkConsistency =
        args.includes('--consistency') || args.includes('--all') || args.length === 0
    const jsonOutput = args.includes('--json')
    const removeUnused = args.includes('--remove')
    const removeExtra = args.includes('--remove-extra')

    log('🔍 I18n Key Analyzer', 'bold')
    log('Analyzing translation keys...', 'dim')

    // Load all locale keys
    const localeKeys = loadLocaleKeys()

    const locales = Array.from(localeKeys.keys())
    log(`Found ${locales.length} locales: ${locales.join(', ')}`, 'dim')

    let hasIssues = false

    // Check for unused keys
    if (checkUnused) {
        if (!jsonOutput) {
            logHeader('UNUSED KEYS CHECK')
        }

        const usageResults = checkUnusedKeys(localeKeys)
        const unusedKeys = usageResults.filter((r) => !r.used)

        if (jsonOutput) {
            console.log(JSON.stringify(unusedKeys.map((r) => r.key), null, 2))
            process.exit(unusedKeys.length > 0 ? 1 : 0)
        }

        if (removeUnused && unusedKeys.length > 0) {
            log(`\n🗑️  Removing ${unusedKeys.length} unused keys from all locale files...`, 'yellow')
            removeUnusedKeys(unusedKeys.map((r) => r.key))
            process.exit(0)
        }

        if (unusedKeys.length === 0) {
            log('✅ All i18n keys are used in the codebase!', 'green')
        } else {
            hasIssues = true
            log(`⚠️  Found ${unusedKeys.length} potentially unused keys:`, 'yellow')
            console.log()

            // Group by namespace
            const groupedKeys: Record<string, string[]> = {}

            for (const { key } of unusedKeys) {
                const parts = key.split('.')
                const namespace = parts[0] || 'root'
                if (!groupedKeys[namespace]) {
                    groupedKeys[namespace] = []
                }
                groupedKeys[namespace].push(key)
            }

            for (const namespace of Object.keys(groupedKeys).sort()) {
                logSubHeader(namespace)
                const keys = groupedKeys[namespace] ?? []
                for (const key of keys.sort()) {
                    log(`  • ${key}`, 'red')
                }
            }

            console.log()
            log(
                'Note: Some keys may be used dynamically or in computed properties.',
                'dim'
            )
            log('Please verify before removing.', 'dim')
        }
    }

    // Check locale consistency
    if (checkConsistency || removeExtra) {
        if (!removeExtra) {
            logHeader('LOCALE CONSISTENCY CHECK')
        }

        const discrepancies = checkLocaleConsistency(localeKeys)

        if (removeExtra) {
            const hasExtra = discrepancies.some((d) => d.extraKeys.length > 0)
            if (hasExtra) {
                log(`\n🗑️  Removing extra keys from locale files...`, 'yellow')
                removeExtraKeys(discrepancies)
            } else {
                log('✅ No extra keys to remove!', 'green')
            }
            process.exit(0)
        }

        if (discrepancies.length === 0) {
            log('✅ All locales are consistent with the reference (en) locale!', 'green')
        } else {
            hasIssues = true

            // Group by locale
            const byLocale = new Map<string, LocaleDiscrepancy[]>()
            for (const d of discrepancies) {
                if (!byLocale.has(d.locale)) {
                    byLocale.set(d.locale, [])
                }
                byLocale.get(d.locale)!.push(d)
            }

            for (const [locale, localeDiscrepancies] of byLocale) {
                logSubHeader(`Locale: ${locale.toUpperCase()}`)

                for (const d of localeDiscrepancies) {
                    log(`\n  📄 ${d.file}:`, 'cyan')

                    if (d.missingKeys.length > 0) {
                        log(`    Missing keys (${d.missingKeys.length}):`, 'red')
                        for (const key of d.missingKeys.slice(0, 20)) {
                            log(`      - ${key}`, 'red')
                        }
                        if (d.missingKeys.length > 20) {
                            log(
                                `      ... and ${d.missingKeys.length - 20} more`,
                                'dim'
                            )
                        }
                    }

                    if (d.extraKeys.length > 0) {
                        log(`    Extra keys (${d.extraKeys.length}):`, 'yellow')
                        for (const key of d.extraKeys.slice(0, 20)) {
                            log(`      + ${key}`, 'yellow')
                        }
                        if (d.extraKeys.length > 20) {
                            log(`      ... and ${d.extraKeys.length - 20} more`, 'dim')
                        }
                    }
                }
            }

            // Summary
            console.log()
            logSubHeader('Summary')

            let totalMissing = 0
            let totalExtra = 0

            for (const d of discrepancies) {
                totalMissing += d.missingKeys.length
                totalExtra += d.extraKeys.length
            }

            log(`  Total missing keys: ${totalMissing}`, 'red')
            log(`  Total extra keys: ${totalExtra}`, 'yellow')
        }
    }

    console.log()
    log('═'.repeat(60), 'cyan')

    if (hasIssues) {
        log('❌ Issues found. Please review the output above.', 'red')
        process.exit(1)
    } else {
        log('✅ All checks passed!', 'green')
        process.exit(0)
    }
}

main().catch((error) => {
    console.error('Error:', error)
    process.exit(1)
})
