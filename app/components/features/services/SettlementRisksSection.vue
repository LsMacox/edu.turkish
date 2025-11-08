<template>
  <section class="settlement-risks-section mb-16">
    <div
      class="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 md:p-12 text-white shadow-xl"
    >
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-4">
          <svg
            class="w-12 h-12 md:w-16 md:h-16 mx-auto text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          {{ displayTitle }}
        </h2>
        <p class="text-gray-200 leading-relaxed text-lg">
          {{ displayContent }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  keyPrefix: string
  title?: string
  content?: string
}

const props = defineProps<Props>()

const { t } = useI18n()

const displayTitle = computed(() => {
  if (props.title) return props.title
  return t(`${props.keyPrefix}.title`)
})

const displayContent = computed(() => {
  if (props.content) return props.content
  return t(`${props.keyPrefix}.content`)
})
</script>
