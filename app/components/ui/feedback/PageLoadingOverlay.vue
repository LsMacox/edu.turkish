<template>
  <Transition name="fade">
    <div
      v-if="isPageLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      :aria-label="t('components.ui.pageLoadingOverlay.ariaLabel')"
    >
      <div class="flex flex-col items-center gap-3 text-primary">
        <Icon name="mdi:loading" class="h-10 w-10 animate-spin" aria-hidden="true" />
        <span class="text-sm font-medium text-secondary">{{ t('common.loading') }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const isPageLoading = useState('ui.pageLoading', () => false)
const { t } = useI18n()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
