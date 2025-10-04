<template>
  <BaseCard :padding="padding" :hover="hover" :rounded="rounded" :class="cardClasses">
    <div v-if="$slots.icon || icon" :class="iconWrapperClasses">
      <slot name="icon">
        <BaseIconBadge v-if="icon" :icon="icon" :color="iconColor" :size="iconSize" />
      </slot>
    </div>

    <div v-if="$slots.title || title" :class="titleClasses">
      <slot name="title">
        <component :is="titleTag" class="text-card-title">
          {{ title }}
        </component>
      </slot>
    </div>

    <div v-if="$slots.description || description" :class="descriptionClasses">
      <slot name="description">
        <p class="text-card-body">
          {{ description }}
        </p>
      </slot>
    </div>

    <div v-if="$slots.footer" class="mt-6">
      <slot name="footer" />
    </div>

    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
import type { BaseIconBadgeProps } from './BaseIconBadge.vue'

export interface BaseFeatureCardProps {
  icon?: string
  iconColor?: BaseIconBadgeProps['color']
  iconSize?: BaseIconBadgeProps['size']
  title?: string
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string
  hover?: boolean | 'lift' | 'scale' | 'shadow'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  centered?: boolean
}

const props = withDefaults(defineProps<BaseFeatureCardProps>(), {
  iconColor: 'blue',
  iconSize: 'lg',
  titleTag: 'h3',
  hover: 'lift',
  padding: 'lg',
  rounded: '2xl',
  centered: false,
})

const cardClasses = computed(() => {
  const classes = []
  if (props.centered) {
    classes.push('text-center')
  }
  return classes.join(' ')
})

const iconWrapperClasses = computed(() => {
  const classes = ['mb-6']
  if (props.centered) {
    classes.push('flex', 'justify-center')
  }
  return classes.join(' ')
})

const titleClasses = computed(() => {
  return 'mb-4'
})

const descriptionClasses = computed(() => {
  return ''
})
</script>
