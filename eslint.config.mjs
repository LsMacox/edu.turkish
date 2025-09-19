import withNuxt from './.nuxt/eslint.config.mjs'

// Extend Nuxt ESLint config with project-specific relaxations to match codebase
export default withNuxt(
  {
    rules: {
      // TypeScript relaxations
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',

      // Import/style relaxations
      'import/first': 'off',
      'import/no-duplicates': 'off',
      'no-useless-escape': 'off',

      // Nuxt-specific rule adjustments for existing code
      'nuxt/prefer-import-meta': 'off'
    }
  },
  {
    files: ['tests/**/*'],
    rules: {
      // Tests commonly stub or use any
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
)
