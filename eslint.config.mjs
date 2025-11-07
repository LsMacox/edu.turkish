// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    ignores: ['.nuxt-test/**', '.nuxt/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    files: ['app/pages/articles/[slug].vue'],
    rules: {
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
])
