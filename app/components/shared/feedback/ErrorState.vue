<template>
  <div :class="['text-center', paddingClass]">
    <Icon :name="icon" class="text-icon-3xl text-error mb-component-sm" />
    <p class="text-error">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
type ErrorStatePadding = 'none' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  message: string
  icon?: string
  padding?: ErrorStatePadding
}>(), {
  icon: 'mdi:alert-circle',
  padding: 'sm',
})

const paddingClasses: Record<ErrorStatePadding, string> = {
  none: '',
  sm: 'section-py-sm',
  md: 'section-py',
  lg: 'section-py-lg',
}

const paddingClass = computed(() => paddingClasses[props.padding])
</script>
