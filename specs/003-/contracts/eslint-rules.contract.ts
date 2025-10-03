/**
 * Contract: ESLint Rule Configuration
 * 
 * Defines ESLint rules to enforce import alias standards
 */

export interface ESLintRuleConfig {
  rule: string
  severity: 'error' | 'warn' | 'off'
  options: any
}

export interface ESLintValidationResult {
  isConfigured: boolean
  rules: ESLintRuleConfig[]
  missingRules: string[]
}

/**
 * Contract Test: ESLint must ban deprecated aliases
 * 
 * GIVEN eslint.config.mjs
 * WHEN checking no-restricted-imports rule
 * THEN @/*, @@/*, and ^/* patterns must be banned
 * AND helpful error messages must be provided
 */
export function validateDeprecatedAliasBan(): ESLintValidationResult {
  throw new Error('Not implemented - contract test')
}

/**
 * Contract Test: ESLint must ban deep relative imports
 * 
 * GIVEN eslint.config.mjs
 * WHEN checking no-restricted-imports rule
 * THEN deep relative import patterns must be banned
 * AND suggestion to use aliases must be provided
 */
export function validateDeepRelativeImportBan(): ESLintValidationResult {
  throw new Error('Not implemented - contract test')
}

/**
 * Required ESLint Rules
 */
export const REQUIRED_ESLINT_RULES: ESLintRuleConfig[] = [
  {
    rule: 'no-restricted-imports',
    severity: 'error',
    options: {
      patterns: [
        {
          group: ['@/*'],
          message: 'Use ~ instead of @ for app imports',
        },
        {
          group: ['@@/*', '^/*'],
          message: 'Use ~~ for root imports',
        },
        {
          group: ['**/../../*', '**/../../../*'],
          message: 'Use aliases (~, ~~) instead of deep relative imports',
        },
      ],
    },
  },
]
