<template>
  <div :class="['text-center', paddingClass]">
    <div
      :class="[
        'inline-block animate-spin rounded-badge border-b-2 border-primary',
        sizeClass,
      ]"
    />
    <p v-if="text" class="text-meta mt-component-sm">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerPadding = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  text?: string
  size?: SpinnerSize
  padding?: SpinnerPadding
}>(), {
  size: 'md',
  padding: 'sm',
})

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

const paddingClasses: Record<SpinnerPadding, string> = {
  none: '',
  sm: 'section-py-sm',
  md: 'section-py',
  lg: 'section-py-lg',
}

const sizeClass = computed(() => sizeClasses[props.size])
const paddingClass = computed(() => paddingClasses[props.padding])
</script>
