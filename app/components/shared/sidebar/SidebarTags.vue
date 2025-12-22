<template>
  <BaseCard
    v-if="tags.length"
    variant="bordered"
    :class="containerClass"
  >
    <h3 class="section-label">
      <Icon name="mdi:tag-multiple" class="text-icon-lg" />
      {{ title }}
    </h3>
    <div class="mt-component-xs flex flex-wrap gap-component-sm">
      <BaseBadge
        v-for="tag in tags"
        :key="tag"
        color="primary"
        variant="soft"
        size="sm"
        rounded="lg"
        class="cursor-pointer hover:bg-primary hover:text-white transition-colors"
      >
        #{{ tag }}
      </BaseBadge>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  tags: string[]
  containerClass?: string
}>(), {
  containerClass: 'hidden lg:block',
})
</script>
