<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div v-if="items.length > 0" class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <Icon v-if="item.icon" :name="item.icon" class="w-10 h-10 text-primary mb-4" />
        <h3 class="text-lg font-semibold mb-2">{{ item.title }}</h3>
        <p class="text-gray-600">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProgramItem {
  title: string
  description: string
  icon: string
}

const props = defineProps<{
  title: string
  items: ProgramItem[]
}>()

const title = computed(() => props.title)
const items = computed(() => props.items)
</script>
