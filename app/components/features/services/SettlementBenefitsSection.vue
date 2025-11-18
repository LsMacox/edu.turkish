<template>
  <section class="settlement-benefits-section">
    <div class="bg-white rounded-2xl p-8 md:p-12 shadow-card border border-gray-100">
      <div class="max-w-4xl mx-auto">
        <div class="md:flex md:items-start md:space-x-8">
          <!-- Icon/Illustration -->
          <div class="flex-shrink-0 mb-6 md:mb-0">
            <div
              class="w-16 h-16 md:w-20 md:h-20 bg-success-light/50 rounded-2xl flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 md:w-10 md:h-10 text-success"
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

          <!-- Content -->
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
