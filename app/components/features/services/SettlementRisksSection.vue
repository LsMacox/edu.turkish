<template>
  <section class="settlement-risks-section mb-16">
    <div
      class="bg-white rounded-2xl p-8 md:p-12 shadow-card border border-gray-100 border-l-4 border-l-warning"
    >
      <div class="max-w-4xl mx-auto">
        <div class="md:flex md:items-start md:space-x-8">
          <div class="flex-shrink-0 mb-6 md:mb-0">
            <div
              class="w-16 h-16 md:w-20 md:h-20 bg-warning-light/50 rounded-2xl flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 md:w-10 md:h-10 text-warning-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div class="flex-grow">
            <h2 class="text-section-title mb-4 text-left">
              {{ displayTitle }}
            </h2>
            <p class="text-body text-gray-600">
              {{ displayContent }}
            </p>
          </div>
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
