<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 max-w-4xl mx-auto">
      <!-- Formats -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">
          {{ t('services.common.acceptedFormats') || 'Accepted Formats' }}
        </h3>
        <ul class="space-y-3">
          <li v-for="(format, index) in formats" :key="index" class="flex items-start gap-3">
            <Icon name="mdi:check-circle" class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <span class="text-gray-700">{{ format }}</span>
          </li>
        </ul>
      </div>

      <!-- Accepted By -->
      <div v-if="acceptedBy" class="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start gap-3">
          <Icon name="mdi:school" class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-semibold text-blue-900 mb-2">
              {{ t('services.common.acceptedByUniversities') || 'Accepted By' }}
            </h4>
            <p class="text-blue-800">{{ acceptedBy }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UniversityRequirementsSectionProps } from '@/types/services'

const props = withDefaults(defineProps<UniversityRequirementsSectionProps>(), {
  title: '',
})

const { t, tm } = useI18n()

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Load formats
const formats = computed(() => {
  if (props.formats && props.formats.length > 0) {
    return props.formats
  }
  const raw = tm(`${props.keyPrefix}.formats`) as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => t(`${props.keyPrefix}.formats.${index}`) as string)
})

// Load acceptedBy text
const acceptedBy = computed(() => {
  if (props.acceptedBy) return props.acceptedBy
  return t(`${props.keyPrefix}.acceptedBy`) as string
})
</script>
