<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <!-- Icon Circle -->
    <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon :name="normalizeIconName(factor.icon)" class="text-primary text-3xl" />
    </div>

    <!-- Factor Content -->
    <div class="space-y-2">
      <h4 class="font-bold text-lg text-secondary">
        {{ factor.title }}
      </h4>
      <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
        {{ factor.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrustFactor } from '~/types/services'

interface Props {
  factor: TrustFactor
}

defineProps<Props>()

function normalizeIconName(icon: unknown): string {
  if (isRef(icon)) return String(unref(icon) ?? '')
  if (typeof icon === 'string') return icon
  if (icon && typeof icon === 'object') {
    const maybe: any = icon
    if (typeof maybe.name === 'string') return maybe.name
    if (typeof maybe.icon === 'string') return maybe.icon
    if (typeof maybe.value === 'string') return maybe.value
  }
  return ''
}
</script>
