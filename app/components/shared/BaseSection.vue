<template>
  <component
    :is="tag"
    :id="id"
    :class="sectionClasses"
  >
    <div v-if="container" :class="['container', maxWidthClasses]">
      <slot />
    </div>
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import type { BaseSectionProps } from '~/types/ui'

const props = withDefaults(defineProps<BaseSectionProps>(), {
  tag: 'section',
  padding: 'md',
  bg: 'default',
  container: true,
})

const sectionClasses = useSectionClasses({
  padding: () => props.padding,
  bg: () => props.bg,
})

const maxWidthClasses = useMaxWidthClasses(() => props.maxWidth, { centered: true })
</script>
