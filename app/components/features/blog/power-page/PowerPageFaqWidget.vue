<template>
  <div class="w-full my-12">
    <div v-for="(item, index) in items" :key="index" class="border-b border-gray-100 last:border-0">
      <button
        class="w-full flex items-center justify-between py-6 text-left transition-colors group"
        @click="toggle(index)"
      >
        <span class="text-lg font-semibold text-secondary group-hover:text-primary transition-colors">
          {{ item.question }}
        </span>
        <Icon
          name="mdi:chevron-down"
          class="text-2xl text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180 text-primary': isOpen(index) }"
        />
      </button>
      <div
        class="grid transition-all duration-300 ease-in-out"
        :class="isOpen(index) ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'"
      >
        <div class="overflow-hidden">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="text-gray-600 leading-relaxed" v-html="item.answer" />
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
