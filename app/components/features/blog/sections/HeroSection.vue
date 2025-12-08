<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/30" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
    
    <div class="relative container mx-auto container-padding-narrow pt-6 md:pt-8 pb-4">
      <div class="text-center max-w-2xl mx-auto mb-6">
        <h1 class="text-section-title mb-2">
          {{ hero.title }}
          <span class="text-primary">{{ hero.titleAccent }}</span>
        </h1>
        <p class="text-section-subtitle mb-4">
          {{ hero.description }}
        </p>

        <div class="flex flex-wrap justify-center gap-4 text-sm mb-4">
          <div
            v-for="(stat, index) in hero.stats"
            :key="index"
            class="flex items-center gap-1.5 text-gray-600"
          >
            <Icon :name="stat.icon" class="text-base text-primary" />
            <span class="font-medium">{{ stat.label }}</span>
          </div>
        </div>

        <div class="relative max-w-md mx-auto">
          <Icon
            name="mdi:magnify"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            :id="searchInputId"
            :name="searchInputId"
            :value="modelValue"
            type="text"
            :placeholder="hero.searchPlaceholder"
            class="w-full px-4 py-3 pl-10 pr-10 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all min-h-touch-44 bg-white"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          />
          <button
            v-if="modelValue"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            :aria-label="t('common.clear')"
            @click="$emit('update:modelValue', '')"
          >
            <Icon name="mdi:close" class="w-4 h-4" />
          </button>
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

const { t } = useI18n()
const searchInputId = useId()
</script>
