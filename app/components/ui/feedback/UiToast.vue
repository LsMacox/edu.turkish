<template>
  <div class="fixed top-4 right-4 z-[60] space-y-3 w-[90vw] max-w-sm">
    <transition-group name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'rounded-xl shadow-lg p-4 border flex gap-3 items-start',
          t.type === 'success' && 'bg-green-50 border-green-200 text-green-900',
          t.type === 'error' && 'bg-red-50 border-red-200 text-red-900',
          t.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-900',
          t.type === 'warning' && 'bg-yellow-50 border-yellow-200 text-yellow-900'
        ]"
      >
        <div class="mt-0.5">
          <Icon v-if="t.type==='success'" name="mdi:check-circle" class="text-green-600" />
          <Icon v-else-if="t.type==='error'" name="mdi:alert-circle" class="text-red-600" />
          <Icon v-else-if="t.type==='warning'" name="mdi:alert" class="text-yellow-600" />
          <Icon v-else name="mdi:information" class="text-blue-600" />
        </div>
        <div class="flex-1">
          <p v-if="t.title" class="font-semibold mb-0.5">{{ t.title }}</p>
          <p class="text-sm leading-snug opacity-90">{{ t.message }}</p>
        </div>
        <button class="opacity-60 hover:opacity-100" @click="remove(t.id)">
          <Icon name="mdi:close" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all .18s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
