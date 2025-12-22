<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    :class="[
      'inline-flex items-center font-medium',
      roundedClasses,
      sizeClasses.container,
      colorClasses,
      outlined ? 'ring-1 ring-inset ring-current' : '',
      removable ? 'pr-1' : '',
    ]"
  >
    <!-- Status dot indicator -->
    <span
      v-if="dot"
      :class="[
        'rounded-full',
        sizeClasses.dot,
        dotColorClasses,
        pulse ? 'animate-pulse' : '',
        $slots.default || icon ? 'mr-1.5' : '',
      ]"
    />

    <!-- Icon (if provided) -->
    <Icon v-if="icon" :name="icon" :class="[sizeClasses.icon, $slots.default ? 'mr-1' : '']" />

    <!-- Badge content -->
    <slot />

    <!-- Remove button (if removable) -->
    <button
      v-if="removable"
      :class="[
        'ml-1 inline-flex items-center justify-center rounded-full',
        'hover:opacity-75 focus:outline-none transition-opacity',
        sizeClasses.removeButton,
      ]"
      :aria-label="removeLabel"
      @click="handleRemove"
    >
      <Icon name="mdi:close" :class="sizeClasses.removeIcon" />
    </button>
  </span>
</template>

<script setup lang="ts">
import type { BaseBadgeProps, BaseBadgeEvents } from '~/types/ui'
import { SEMANTIC_BG_COLORS, SEMANTIC_BADGE_COLORS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseBadgeProps>(), {
  color: 'neutral',
  size: 'md',
  variant: 'soft',
  rounded: 'xl',
  removable: false,
  removeLabel: 'Remove',
  dot: false,
  pulse: false,
  outlined: false,
  ariaLabel: undefined,
})

const emit = defineEmits<BaseBadgeEvents>()

const roundedClasses = useRoundedClasses(() => props.rounded, { context: 'badge' })
const sizeClasses = useBadgeSizeClasses(() => props.size)

const dotColorClasses = computed(() => {
  return SEMANTIC_BG_COLORS[props.color] || SEMANTIC_BG_COLORS.neutral
})

const colorClasses = computed(() => {
  const { color, variant } = props
  return SEMANTIC_BADGE_COLORS[color]?.[variant] || SEMANTIC_BADGE_COLORS.neutral.soft
})

const handleRemove = () => {
  emit('remove')
}
</script>
