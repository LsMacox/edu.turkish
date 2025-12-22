<template>
  <BaseCard variant="surface" class="break-inside-avoid mb-component-lg">
    <BaseIconBox :icon="icon" :color="iconColor" size="md" class="mb-component-lg" />
    <div class="space-component-sm">
      <button type="button" class="w-full text-left" @click="$emit('toggle')">
        <p class="text-body-sm">{{ label }}</p>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-card-title">{{ title }}</span>
          <span class="ml-3 text-hint text-icon-lg">
            <span v-if="isOpen">−</span>
            <span v-else>+</span>
          </span>
        </div>
        <p class="mt-1 text-body-sm text-meta italic">{{ quote }}</p>
      </button>
      <div v-if="isOpen" class="border-t pt-component-sm">
        <p class="text-body whitespace-pre-line">
          {{ answer }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'

export interface FearCardProps {
  icon: string
  iconColor: BaseIconBoxProps['color']
  label: string
  title: string
  quote: string
  answer: string
  isOpen: boolean
}

defineProps<FearCardProps>()
defineEmits<{
  toggle: []
}>()
</script>
