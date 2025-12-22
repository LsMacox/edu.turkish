<template>
  <div class="mt-component-lg">
    <BaseSectionHeader :title="title" />

    <BaseGrid v-if="items.length > 0" :md="2" :lg="4" gap="lg" class="mt-component-lg">
      <BaseCard
        v-for="(item, index) in items"
        :key="index"
        padding="lg"
        shadow="none"
        rounded="lg"
        bordered
        hover="shadow"
      >
        <Icon v-if="item.icon" :name="item.icon" class="w-10 h-10 text-primary mb-component-md" />
        <h3 class="text-card-title mb-component-xs">{{ item.title }}</h3>
        <p class="text-body-sm">{{ item.description }}</p>
      </BaseCard>
    </BaseGrid>
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
