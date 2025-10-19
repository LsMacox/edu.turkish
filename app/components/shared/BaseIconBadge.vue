<template>
  <div :class="badgeClasses">
    <Icon :name="icon" :class="iconClasses" />
  </div>
</template>

<script setup lang="ts">
export interface BaseIconBadgeProps {
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<BaseIconBadgeProps>(), {
  color: 'blue',
  size: 'md',
  rounded: '2xl',
})

const badgeClasses = computed(() => {
  const classes = ['flex', 'items-center', 'justify-center']

  // Size classes
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  }
  classes.push(sizeMap[props.size])

  // Color classes (background)
  const colorMap = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    pink: 'bg-pink-100',
    teal: 'bg-teal-100',
  }
  classes.push(colorMap[props.color])

  // Rounded classes
  const roundedMap = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }
  classes.push(roundedMap[props.rounded])

  return classes.join(' ')
})

const iconClasses = computed(() => {
  const classes = []

  // Icon size
  const iconSizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }
  classes.push(iconSizeMap[props.size])

  // Icon color
  const iconColorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600',
    teal: 'text-teal-600',
  }
  classes.push(iconColorMap[props.color])

  return classes.join(' ')
})
</script>
