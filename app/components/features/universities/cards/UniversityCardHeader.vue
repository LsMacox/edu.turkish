<!--
/**
 * UniversityCardHeader Component
 * 
 * Displays university title, type badge, and featured indicator with proper accessibility.
 * Part of the University Card composition pattern for better maintainability.
 * 
 * @component UniversityCardHeader
 * @example
 * ```vue
 * <UniversityCardHeader 
 *   title="Istanbul Technical University"
 *   type="state"
 *   type-label="State University"
 *   :featured="true"
 * />
 * ```
 */
-->
<template>
  <div class="flex items-start justify-between mb-3">
    <h3 class="text-base md:text-lg font-semibold text-secondary line-clamp-2">
      {{ title }}
    </h3>

    <div class="flex items-center gap-2 ml-2 flex-shrink-0">
      <BaseBadge v-if="featured" color="warning" size="sm">
        <Icon name="mdi:star" class="w-3 h-3 mr-1" />
        Featured
      </BaseBadge>

      <BaseBadge v-if="typeLabel" :color="getBadgeColor(type)" size="sm">
        {{ typeLabel }}
      </BaseBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SemanticColor } from '~/types/ui'
interface Props {
  title: string
  type?: string
  typeLabel?: string
  featured?: boolean
}

withDefaults(defineProps<Props>(), {
  featured: false,
  type: '',
  typeLabel: '',
})

const getBadgeColor = (type?: string): SemanticColor => {
  switch (type) {
    case 'state':
      return 'info'
    case 'private':
      return 'warning'
    case 'tech':
      return 'primary'
    case 'elite':
      return 'success'
    default:
      return 'neutral'
  }
}
</script>
