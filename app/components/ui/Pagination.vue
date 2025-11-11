<template>
  <nav
    v-if="visible"
    class="mt-8 flex items-center justify-center gap-1 text-sm select-none"
    role="navigation"
    aria-label="Pagination"
  >
    <button
      type="button"
      class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
      :disabled="disabled || page <= 1"
      aria-label="Previous page"
      @click="goTo(page - 1)"
    >
      ‹
    </button>

    <button
      v-for="(item, idx) in range"
      :key="idx"
      type="button"
      :disabled="item === '…' || disabled"
      class="px-3 py-2 rounded-lg border text-center min-w-[40px]"
      :class="
        item === '…'
          ? 'border-transparent text-gray-400 cursor-default'
          : item === page
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
      "
      :aria-current="item === page ? 'page' : undefined"
      @click="typeof item === 'number' && goTo(item)"
    >
      {{ item }}
    </button>

    <button
      type="button"
      class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
      :disabled="disabled || page >= pageCount"
      aria-label="Next page"
      @click="goTo(page + 1)"
    >
      ›
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    pageCount: number
    disabled?: boolean
    siblingCount?: number
    boundaryCount?: number
    alwaysShow?: boolean
  }>(),
  {
    disabled: false,
    siblingCount: 1,
    boundaryCount: 1,
    alwaysShow: false,
  },
)

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

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
