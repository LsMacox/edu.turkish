<template>
  <BaseCard
    v-if="items.length"
    variant="bordered"
    :class="containerClass"
  >
    <h3 class="section-label">
      <Icon name="mdi:format-list-bulleted" class="text-icon-lg" />
      {{ title }}
    </h3>
    <nav class="mt-component-sm space-y-1">
      <button
        v-for="section in items"
        :key="section.id"
        type="button"
        class="group flex w-full items-center gap-component-md rounded-button px-3 py-2.5 text-body-sm text-left transition-default hover:bg-primary/5"
        :class="{ 'bg-primary/10': activeId === section.id }"
        @click="$emit('scroll-to', section.id)"
      >
        <span
          class="toc-badge transition-color"
          :class="
            activeId === section.id
              ? 'bg-primary text-white'
              : 'bg-surface-elevated text-meta group-hover:bg-primary group-hover:text-white'
          "
        >
          {{ section.order }}
        </span>
        <span
          class="line-clamp-2 transition-color"
          :class="
            activeId === section.id
              ? 'text-secondary font-medium'
              : 'text-body-sm group-hover:text-secondary'
          "
        >
          {{ section.title }}
        </span>
      </button>
    </nav>
  </BaseCard>
</template>

<script setup lang="ts">
export interface TableOfContentsItem {
  id: string
  title: string
  order: string
}

withDefaults(defineProps<{
  title: string
  items: TableOfContentsItem[]
  activeId?: string | null
  containerClass?: string
}>(), {
  containerClass: 'hidden md:block',
})

defineEmits<{
  'scroll-to': [id: string]
}>()
</script>
