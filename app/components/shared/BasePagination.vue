<template>
  <nav
    v-if="visible"
    class="mt-8 flex items-center justify-center gap-component-xs text-sm select-none"
    role="navigation"
    aria-label="Pagination"
  >
    <BaseButton
      variant="pagination"
      :disabled="disabled || page <= 1"
      aria-label="Previous page"
      @click="goTo(page - 1)"
    >
      ‹
    </BaseButton>

    <BaseButton
      v-for="(item, idx) in range"
      :key="idx"
      variant="pagination"
      :disabled="item === '…' || disabled"
      :class="item === '…' ? '!border-transparent !text-hint' : ''"
      :data-active="item === page ? 'true' : undefined"
      :aria-current="item === page ? 'page' : undefined"
      @click="typeof item === 'number' && goTo(item)"
    >
      {{ item }}
    </BaseButton>

    <BaseButton
      variant="pagination"
      :disabled="disabled || page >= pageCount"
      aria-label="Next page"
      @click="goTo(page + 1)"
    >
      ›
    </BaseButton>
  </nav>
</template>

<script setup lang="ts">
import type { BasePaginationProps, BasePaginationEvents } from '~/types/ui'

const props = withDefaults(defineProps<BasePaginationProps>(), {
  disabled: false,
  siblingCount: 1,
  boundaryCount: 1,
  alwaysShow: false,
})

const emit = defineEmits<BasePaginationEvents>()

const visible = computed(() => props.alwaysShow || (props.pageCount && props.pageCount > 1))

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

const goTo = (p: number) => {
  const target = clamp(p, 1, props.pageCount || 1)
  if (target !== props.page && !props.disabled) {
    emit('update:page', target)
  }
}

const range = computed<(number | '…')[]>(() => {
  const total = Math.max(1, props.pageCount || 1)
  const current = clamp(props.page || 1, 1, total)
  const sib = Math.max(0, props.siblingCount || 0)
  const bnd = Math.max(0, props.boundaryCount || 0)

  const pages: (number | '…')[] = []
  const startPages = Array.from({ length: Math.min(bnd, total) }, (_, i) => i + 1)
  const endPages = Array.from({ length: Math.min(bnd, total) }, (_, i) => total - i).reverse()

  const left = Math.max(current - sib, 1)
  const right = Math.min(current + sib, total)

  const middle: number[] = []
  for (let p = left; p <= right; p++) middle.push(p)

  const merged = [...new Set([...startPages, ...middle, ...endPages])].sort((a, b) => a - b)

  let last = 0
  for (const p of merged) {
    if (last && p - last > 1) pages.push('…')
    pages.push(p)
    last = p
  }
  return pages
})
</script>
