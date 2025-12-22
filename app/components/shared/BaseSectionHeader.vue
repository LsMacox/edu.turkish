<template>
  <div :class="[containerClasses, marginClasses]">
    <!-- Pre-title (optional) -->
    <p v-if="preTitle || $slots.preTitle" :class="preTitleClasses">
      <slot name="preTitle">{{ preTitle }}</slot>
    </p>

    <!-- Main title -->
    <component :is="titleTag" v-if="title || $slots.title" :class="titleClasses">
      <slot name="title">{{ title }}</slot>
    </component>

    <!-- Subtitle -->
    <p v-if="subtitle || $slots.subtitle" :class="subtitleClasses">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>

    <!-- Action slot (e.g., buttons, links) -->
    <div v-if="$slots.action" :class="actionClasses">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseSectionHeaderProps } from '~/types/ui'
import { MARGIN_BOTTOM_CLASSES } from '~/composables/ui'

const props = withDefaults(defineProps<BaseSectionHeaderProps>(), {
  titleTag: 'h2',
  size: 'lg',
  align: 'center',
  marginBottom: 'lg',
  maxWidth: '2xl',
  balanced: true,
})

const slots = useSlots()

const maxWidthClasses = useMaxWidthClasses(() => props.maxWidth, { defaultWidth: '2xl' })
const alignClasses = useAlignClasses(() => props.align, { context: 'text', defaultAlign: 'center' })

const containerClasses = computed(() => [
  alignClasses.value,
  maxWidthClasses.value
].join(' '))

const marginClasses = computed(() => {
  return MARGIN_BOTTOM_CLASSES[props.marginBottom] || MARGIN_BOTTOM_CLASSES.lg
})

const sizeClasses = useSectionHeaderSizeClasses(() => props.size)

const preTitleClasses = computed(() => {
  return [
    sizeClasses.value.preTitle,
    'text-primary font-semibold uppercase tracking-wider mb-2',
  ].join(' ')
})

const titleClasses = computed(() => {
  return [
    sizeClasses.value.title,
    props.balanced ? 'text-balance' : '',
    props.subtitle || slots.subtitle ? 'mb-4' : '',
  ]
    .filter(Boolean)
    .join(' ')
})

const subtitleClasses = computed(() => {
  return ['text-section-subtitle', props.balanced ? 'text-balance' : ''].filter(Boolean).join(' ')
})

const flexAlignClasses = useAlignClasses(() => props.align, { context: 'flex', defaultAlign: 'center' })

const actionClasses = computed(() => {
  return [
    'mt-6',
    props.align !== 'left' ? `flex ${flexAlignClasses.value}` : '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>
