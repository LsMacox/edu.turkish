<template>
  <section class="settlement-benefits-section bg-gray-50 rounded-lg p-8 md:p-12">
    <div class="max-w-4xl mx-auto">
      <div class="md:flex md:items-center md:space-x-8">
        <!-- Icon/Illustration (left side on desktop) -->
        <div class="flex-shrink-0 mb-6 md:mb-0">
          <div
            class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <svg
              class="w-8 h-8 md:w-10 md:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Content (right side on desktop) -->
        <div class="flex-grow">
          <h2 class="text-2xl md:text-3xl font-bold text-secondary mb-4">
            {{ displayTitle }}
          </h2>
          <p class="text-gray-700 leading-relaxed text-lg">
            {{ displayContent }}
          </p>
        </div>
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
