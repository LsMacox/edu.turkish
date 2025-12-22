<template>
  <div class="fixed top-4 right-4 z-toast space-y-3 w-[90vw] max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['rounded-button shadow-card p-4 border flex gap-component-md items-start', getToastColors(t.type).container]"
        role="alert"
        :aria-live="t.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="mt-0.5">
          <Icon :name="toastIcons[t.type]" :class="getToastColors(t.type).icon" />
        </div>
        <div class="flex-1">
          <p v-if="t.title" class="font-semibold mb-0.5">{{ t.title }}</p>
          <p class="text-sm leading-snug opacity-90">{{ t.message }}</p>
        </div>
        <BaseButton variant="toast-close" icon="mdi:close" aria-label="Close" no-focus-ring @click="remove(t.id)" />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { ToastType } from '~/types/ui'
import { SEMANTIC_TOAST_COLORS } from '~/composables/ui'

const { toasts, remove } = useToast()

const toastIcons: Record<ToastType, string> = {
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  warning: 'mdi:alert',
  info: 'mdi:information',
}

const getToastColors = (type: ToastType) => SEMANTIC_TOAST_COLORS[type] || SEMANTIC_TOAST_COLORS.info
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.18s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
