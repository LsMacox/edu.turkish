/**
 * Type-safe i18n key paths generator
 *
 * This module provides utility types to generate dot-notation key paths
 * from the I18nSchema interface, enabling autocomplete and compile-time
 * validation of translation keys.
 */

import type { I18nSchema } from './schema'

/**
 * Recursively generates all possible dot-notation paths from a nested object type.
 * Handles nested objects, arrays, and primitive values.
 *
 * @example
 * type Schema = { foo: { bar: string; baz: { qux: string } } }
 * type Keys = PathKeys<Schema> // 'foo.bar' | 'foo.baz.qux'
 */
export type PathKeys<T, Prefix extends string = ''> = T extends string | number | boolean
    ? Prefix extends ''
        ? never
        : Prefix
    : T extends Array<infer U>
        ? PathKeys<U, Prefix extends '' ? `${number}` : `${Prefix}.${number}`>
        : T extends object
            ? {
                [K in keyof T & string]: PathKeys<
                    T[K],
                    Prefix extends '' ? K : `${Prefix}.${K}`
                >
            }[keyof T & string]
            : never

/**
 * All valid translation key paths derived from I18nSchema.
 * Use this type to validate translation keys at compile time.
 *
 * @example
 * const key: I18nKeyPath = 'universities_page.hero.title' // ✓ valid
 * const invalid: I18nKeyPath = 'invalid.key.path' // ✗ error
 */
export type I18nKeyPath = PathKeys<I18nSchema>

/**
 * Helper function to create type-safe translation keys.
 * Returns the key as-is but provides compile-time validation.
 *
 * @example
 * const { t } = useI18n()
 * t(key('universities_page.hero.title')) // autocomplete + validation
 */
export function key<K extends I18nKeyPath>(k: K): K {
    return k
}

/**
 * Namespace helper for grouping related keys.
 * Useful for components that use many keys from the same namespace.
 *
 * @example
 * const ns = namespace('universities_page.filters')
 * t(ns('search_label')) // 'universities_page.filters.search_label'
 */
export function namespace<N extends string>(ns: N) {
    return <K extends string>(k: K): `${N}.${K}` => `${ns}.${k}` as `${N}.${K}`
}
