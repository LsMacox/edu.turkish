<template>
  <div
    :class="[
      sizeClass,
      'transition-default',
      hoverScale && 'group-hover:scale-110',
      hoverBgPrimary && 'group-hover:bg-primary',
    ]"
  >
    <Icon
      :name="icon"
      :class="[
        iconSizeClass,
        iconColor,
        hoverIconWhite && 'group-hover:text-white',
        'transition-color',
        isPlayIcon && 'ml-0.5',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import type { Size } from '~/types/ui'

type MediaButtonSize = Extract<Size, 'md' | 'lg'>
type Variant = 'play' | 'zoom'

interface Props {
  icon: string
  size?: MediaButtonSize
  variant?: Variant
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  variant: 'play',
})

const sizeClass = computed(() => props.size === 'lg' ? 'media-btn-lg' : 'media-btn-md')

const iconSizeClass = computed(() => props.size === 'lg' ? 'text-icon-lg' : 'text-icon')

const isPlayIcon = computed(() => props.icon === 'mdi:play')

const iconColor = computed(() => props.variant === 'play' ? 'text-primary' : 'text-secondary')

const hoverScale = computed(() => props.variant === 'play')

const hoverBgPrimary = computed(() => props.variant === 'play')

const hoverIconWhite = computed(() => props.variant === 'play')
</script>
