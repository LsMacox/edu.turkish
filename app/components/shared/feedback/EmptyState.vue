<template>
  <div :class="['text-center', paddingClass]">
    <div
      v-if="icon"
      class="icon-box-lg bg-surface-elevated mx-auto mb-component-sm"
    >
      <Icon :name="icon" :class="['text-icon-xl', iconColorClass]" />
    </div>
    <p v-if="title" class="font-medium text-secondary mb-1">{{ title }}</p>
    <p v-if="text" class="text-meta">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
type EmptyStatePadding = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  icon?: string
  iconColor?: 'hint' | 'primary' | 'error'
  title?: string
  text?: string
  padding?: EmptyStatePadding
}>(), {
  iconColor: 'hint',
  padding: 'sm',
})

const paddingClasses: Record<EmptyStatePadding, string> = {
  none: '',
  sm: 'section-py-sm',
  md: 'section-py',
  lg: 'section-py-lg',
}

const iconColorClasses: Record<string, string> = {
  hint: 'text-hint',
  primary: 'text-primary',
  error: 'text-error',
}

const paddingClass = computed(() => paddingClasses[props.padding])
const iconColorClass = computed(() => iconColorClasses[props.iconColor])
</script>
