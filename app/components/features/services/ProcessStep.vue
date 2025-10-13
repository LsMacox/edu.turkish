<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <!-- Step Number Circle with Icon -->
    <div class="relative">
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl"
        :aria-label="`Step ${step.stepNumber}`"
      >
        {{ step.stepNumber }}
      </div>
      <div
        class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
      >
        <Icon :name="normalizeIconName(step.icon)" class="text-white text-xl" />
      </div>
    </div>

    <!-- Step Content -->
    <div class="space-y-2">
      <h4 class="font-bold text-lg text-secondary">
        {{ step.title }}
      </h4>
      <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
        {{ step.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProcessStep } from '~/types/services'
import { isRef, unref } from 'vue'

interface Props {
  step: ProcessStep
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
