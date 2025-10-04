import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

// Project ESLint (flat) config extending Nuxt defaults, with minimal customizations
export default withNuxt(
  // Global ignores
  {
    ignores: [
      '.nuxt/**',
      'node_modules/**',
      '.output/**',
      'dist/**',
      'coverage/**',
      'public/**',
      'uploads/**',
      'generated/**',
      'eslint.config.*',
    ],
  },
  // Turn off formatting-related rules to defer to Prettier
  prettier,
  // Base rule tweaks
  {
    rules: {
      // General
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-useless-escape': 'off',
      'vue/attributes-order': 'off',

      // Nuxt/Vue
      'nuxt/prefer-import-meta': 'off',
    },
  },
  // TypeScript/Vue specific rules
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-dynamic-delete': 'off',
    },
  },
  // Pages (allow single-word component names)
  {
    files: ['app/pages/**/*.vue', 'pages/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // Tests
  {
    files: ['tests/**/*'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  // Server-side and scripts (allow console)
  {
    files: ['server/**/*', 'scripts/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
  // Seed scripts (allow console)
  {
    files: ['prisma/seed/**/*'],
    rules: {
      'no-console': 'off',
    },
  },
)
