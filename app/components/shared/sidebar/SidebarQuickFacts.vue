<template>
  <div
    v-if="items.length"
    :class="[
      'overflow-hidden rounded-card bg-gradient-to-br from-primary to-secondary p-[2px] shadow-card',
      containerClass,
    ]"
  >
    <div class="rounded-card-inner bg-white card-padding-sm">
      <h3 class="section-label">
        <Icon name="mdi:lightning-bolt" class="text-icon-lg text-primary" />
        {{ title }}
      </h3>
      <ul class="mt-component-sm space-component-sm">
        <li v-for="fact in items" :key="fact.title" class="flex gap-component-md">
          <span class="icon-box-sm bg-primary/10">
            <Icon
              :name="fact.icon || 'mdi:information-outline'"
              class="text-icon sm:text-icon-lg text-primary"
            />
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-body-sm font-medium uppercase tracking-wide text-hint mb-1">
              {{ fact.title }}
            </p>
            <p class="text-body-sm font-semibold text-secondary break-words">{{ fact.value }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface QuickFactItem {
  title: string
  value: string
  icon?: string
}

withDefaults(defineProps<{
  title: string
  items: QuickFactItem[]
  containerClass?: string
}>(), {
  containerClass: 'hidden lg:block',
})
</script>
