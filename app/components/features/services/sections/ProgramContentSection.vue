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

interface ProgramContentSectionProps {
  keyPrefix: string
  title?: string
  columns?: number
}

const props = withDefaults(defineProps<ProgramContentSectionProps>(), {
  title: '',
  columns: 2,
})

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const items = computed(() => {
  const raw = tm(`${props.keyPrefix}.items`) as unknown
  const arrayItems = Array.isArray(raw) ? (raw as unknown[]) : []
  return arrayItems.map((_, index) => ({
    title: t(`${props.keyPrefix}.items.${index}.title`) as string,
    description: t(`${props.keyPrefix}.items.${index}.description`) as string,
    icon: t(`${props.keyPrefix}.items.${index}.icon`) as string,
  })) as ProgramItem[]
})
</script>
