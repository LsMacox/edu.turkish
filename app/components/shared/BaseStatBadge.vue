<template>
  <div :class="badgeClasses">
    <div v-if="icon" :class="iconWrapperClasses">
      <Icon :name="icon" :class="iconClasses" />
    </div>
    <div :class="contentClasses">
      <div v-if="value" :class="valueClasses">
        {{ value }}
      </div>
      <div :class="labelClasses">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaseStatBadgeProps {
  icon?: string
  label: string
  value?: string
  color?: 'primary' | 'success' | 'info' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  layout?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<BaseStatBadgeProps>(), {
  color: 'primary',
  size: 'md',
  layout: 'horizontal',
})

const badgeClasses = computed(() => {
  const classes = ['inline-flex', 'items-center', 'gap-3', 'rounded-xl', 'transition-all']

  // Layout
  if (props.layout === 'vertical') {
    classes.push('flex-col', 'text-center')
  }

  // Size classes
  const sizeMap = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  }
  classes.push(sizeMap[props.size])

  // Color classes
  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-orange-100 text-orange-700',
  }
  classes.push(colorMap[props.color])

  return classes.join(' ')
})

const iconWrapperClasses = computed(() => {
  return 'flex-shrink-0'
})

const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }
  return sizeMap[props.size]
})

const contentClasses = computed(() => {
  const classes = ['flex', 'flex-col']
  if (props.layout === 'horizontal') {
    classes.push('items-start')
  } else {
    classes.push('items-center')
  }
  return classes.join(' ')
})

const valueClasses = computed(() => {
  const sizeMap = {
    sm: 'text-lg font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
  }
  return sizeMap[props.size]
})

const labelClasses = computed(() => {
  const sizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  return `${sizeMap[props.size]} font-medium opacity-80`
})
</script>
