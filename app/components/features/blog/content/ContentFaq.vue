<template>
  <div class="w-full my-5 space-y-2">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="rounded-2xl border transition-all duration-300"
      :class="
        isOpen(index)
          ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-transparent shadow-sm'
          : 'border-gray-100 bg-white hover:border-gray-200'
      "
    >
      <button
        class="w-full flex items-center justify-between p-5 text-left transition-colors group"
        @click="toggle(index)"
      >
        <span
          class="text-base md:text-lg font-semibold pr-4 transition-colors"
          :class="isOpen(index) ? 'text-primary' : 'text-secondary group-hover:text-primary'"
        >
          {{ item.question }}
        </span>
        <span
          class="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300"
          :class="
            isOpen(index)
              ? 'bg-primary text-white rotate-180'
              : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
          "
        >
          <Icon name="mdi:chevron-down" class="text-lg" />
        </span>
      </button>
      <div
        class="grid transition-all duration-300 ease-in-out"
        :class="isOpen(index) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="px-5 pb-5 text-gray-600 leading-relaxed" v-html="item.answer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ question: string; answer: string }>
}>()

const openIndex = ref<number | null>(0)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index: number) => openIndex.value === index
</script>
