<!--
/**
 * UniversityCardActions Component
 * 
 * Provides action buttons for university cards (view details, apply).
 * Handles navigation and application modal triggering.
 * 
 * @component UniversityCardActions
 * @example
 * ```vue
 * <UniversityCardActions 
 *   detail-href="/university/istanbul-tech"
 *   apply-label="Apply Now"
 *   detail-label="View Details"
 *   @apply="openApplicationModal"
 * />
 * ```
 */
-->
<template>
  <div class="mt-auto pt-4 space-y-2">
    <NuxtLink
      :to="detailHref"
      class="inline-flex items-center justify-center font-semibold px-6 py-3 text-base rounded-xl bg-primary text-white border border-primary hover:bg-red-600 hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 w-full"
    >
      {{ detailLabel || 'View Details' }}
    </NuxtLink>
    
    <UiFormsBaseButton
      variant="outline"
      size="md"
      fullWidth
      @click="$emit('apply')"
    >
      {{ applyLabel || 'Apply Now' }}
    </UiFormsBaseButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  detailHref?: string
  applyLabel?: string
  detailLabel?: string
}

defineProps<Props>()

defineEmits<{
  apply: []
}>()
</script>