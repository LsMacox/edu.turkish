<template>
  <div class="space-y-2 mb-4">
    <div class="flex items-center text-sm text-gray-600">
      <Icon name="mdi:map-marker" class="text-primary w-4 mr-2" />
      <span>{{ city }}</span>
    </div>
    
    <div class="flex items-center text-sm text-gray-600">
      <Icon name="mdi:translate" class="text-primary w-4 mr-2" />
      <span>{{ languages.join(', ') }}</span>
    </div>
    
    <div class="flex items-center text-sm text-gray-600">
      <Icon name="mdi:currency-usd" class="text-primary w-4 mr-2" />
      <span v-if="formattedTuition && formattedTuition !== '0'">от ${{ formattedTuition }}/год</span>
      <span v-else>Цена по запросу</span>
    </div>

    <div v-if="badgeComputed" class="flex items-center">
      <UiDisplayBaseBadge :color="getBadgeColor(badgeComputed.color)" size="sm">
        {{ badgeLabel }}
      </UiDisplayBaseBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  city?: string
  languages?: string[]
  tuition?: number | string
  badge?: string | { label?: string; labelKey?: string; color?: string }
}

const props = withDefaults(defineProps<Props>(), {
  city: '',
  languages: () => [],
  tuition: undefined,
  badge: ''
})

const formattedTuition = computed(() => {
  // Handle different input types
  let tuitionValue = 0
  
  if (props.tuition === undefined || props.tuition === null) {
    tuitionValue = 0
  } else if (typeof props.tuition === 'string') {
    tuitionValue = parseInt(props.tuition) || 0
  } else if (typeof props.tuition === 'number') {
    tuitionValue = props.tuition
  }
  
  
  // Return formatted number with space separator for consistency
  return tuitionValue > 0 ? tuitionValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'
})

const getBadgeColor = (colorType?: string): string => {
  switch (colorType) {
    case 'green': return 'success'
    case 'blue': return 'info'
    case 'orange': return 'warning'
    case 'purple': return 'primary'
    case 'yellow': return 'warning'
    default: return 'neutral'
  }
}

const { t, te } = useI18n()

const badgeComputed = computed(() => {
  if (!props.badge) return undefined
  if (typeof props.badge === 'string') return undefined
  return props.badge
})

const badgeLabel = computed(() => {
  const b = badgeComputed.value
  if (!b) return ''
  if (b.labelKey && te(b.labelKey)) return t(b.labelKey)
  return b.label || ''
})
</script>