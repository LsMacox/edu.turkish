<template>
  <a
    :href="href"
    :class="linkClasses"
    :aria-label="ariaLabel || defaultAriaLabel"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon :name="iconName" :class="iconClasses" />
  </a>
</template>

<script setup lang="ts">
export interface BaseSocialLinkProps {
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'twitter'
  href: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'filled' | 'outline'
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseSocialLinkProps>(), {
  size: 'md',
  variant: 'filled',
})

const platformConfig = {
  whatsapp: {
    icon: 'mdi:whatsapp',
    color: 'green',
    label: 'WhatsApp',
  },
  telegram: {
    icon: 'mdi:telegram',
    color: 'blue',
    label: 'Telegram',
  },
  instagram: {
    icon: 'mdi:instagram',
    color: 'pink',
    label: 'Instagram',
  },
  linkedin: {
    icon: 'mdi:linkedin',
    color: 'blue',
    label: 'LinkedIn',
  },
  facebook: {
    icon: 'mdi:facebook',
    color: 'blue',
    label: 'Facebook',
  },
  youtube: {
    icon: 'mdi:youtube',
    color: 'red',
    label: 'YouTube',
  },
  twitter: {
    icon: 'mdi:twitter',
    color: 'blue',
    label: 'Twitter',
  },
}

const config = computed(() => platformConfig[props.platform])

const iconName = computed(() => config.value.icon)

const defaultAriaLabel = computed(() => config.value.label)

const linkClasses = computed(() => {
  const classes = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-lg',
    'transition-all',
    'duration-300',
  ]

  // Size classes
  const sizeMap = {
    sm: 'w-8 h-8 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-12 h-12 md:w-14 md:h-14',
  }
  classes.push(sizeMap[props.size])

  // Variant and color classes
  if (props.variant === 'filled') {
    const colorMap = {
      green: 'bg-green-500 hover:bg-green-600 text-white',
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white',
      red: 'bg-red-500 hover:bg-red-600 text-white',
    }
    classes.push(colorMap[config.value.color as keyof typeof colorMap])
    classes.push('hover:scale-105')
  } else {
    const colorMap = {
      green: 'border-2 border-green-500 text-green-500 hover:bg-green-50',
      blue: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
      pink: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-50',
      red: 'border-2 border-red-500 text-red-500 hover:bg-red-50',
    }
    classes.push(colorMap[config.value.color as keyof typeof colorMap])
  }

  return classes.join(' ')
})

const iconClasses = computed(() => {
  const sizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }
  return sizeMap[props.size]
})
</script>
