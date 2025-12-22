<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 gradient-hero-blog" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
    
    <div class="relative container mx-auto container-padding-narrow section-py-sm">
      <div class="text-center max-w-2xl mx-auto mb-component-lg">
        <h1 class="text-section-title mb-component-xs">
          {{ hero.title }}
          <span class="text-primary">{{ hero.titleAccent }}</span>
        </h1>
        <p class="text-section-subtitle mb-component-md">
          {{ hero.description }}
        </p>

        <div class="flex flex-wrap justify-center gap-component-lg text-body-sm mb-component-md">
          <div
            v-for="(stat, index) in hero.stats"
            :key="index"
            class="flex items-center gap-component-xs text-body-sm"
          >
            <Icon :name="stat.icon" class="text-icon text-primary" />
            <span class="font-medium">{{ stat.label }}</span>
          </div>
        </div>

        <div class="max-w-md mx-auto">
          <BaseTextField
            :id="searchInputId"
            :name="searchInputId"
            :model-value="modelValue"
            type="text"
            :placeholder="hero.searchPlaceholder"
            icon="mdi:magnify"
            icon-position="left"
            clearable
            @update:model-value="$emit('update:modelValue', String($event))"
          />
        </div>
      </div>

      <!-- Categories slot -->
      <slot name="categories" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  hero: {
    title: string
    titleAccent: string
    description: string
    searchPlaceholder: string
    imageAlt?: string
    highlight?: { title: string; subtitle: string }
    stats: Array<{ icon: string; label: string }>
  }
  heroImage?: string
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchInputId = useId()
</script>
