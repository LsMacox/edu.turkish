<template>
  <BaseCard :padding="padding" :hover="hover" :rounded="rounded" :class="cardClasses">
    <div v-if="icon" :class="iconWrapperClasses">
      <BaseIconBox :icon="icon" :color="iconColor" :size="iconSize" />
    </div>

    <div v-if="title" :class="titleClasses">
      <component :is="titleTag" class="text-card-title">
        {{ title }}
      </component>
    </div>

    <div v-if="description" :class="descriptionClasses">
      <p class="text-card-body">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.footer" class="mt-component-lg">
      <slot name="footer" />
    </div>

    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'

export interface ServiceOverviewCardProps {
  icon?: string
  iconColor?: BaseIconBoxProps['color']
  iconSize?: BaseIconBoxProps['size']
  title?: string
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string
  hover?: boolean | 'lift' | 'scale' | 'shadow'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  centered?: boolean
}

const props = withDefaults(defineProps<ServiceOverviewCardProps>(), {
  iconColor: 'info',
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
  const classes = ['mb-component-lg']
  if (props.centered) {
    classes.push('flex', 'justify-center')
  }
  return classes.join(' ')
})

const titleClasses = computed(() => {
  return 'mb-component-md'
})

const descriptionClasses = computed(() => {
  return ''
})
</script>
