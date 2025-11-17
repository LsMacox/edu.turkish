<template>
  <section class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 section-py-lg">
    <div class="container mx-auto container-padding-narrow">
      <div class="grid lg:grid-cols-2 gap-section-lg items-center">
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-hero">
              {{ hero.title }}
              <span class="text-primary">{{ hero.titleAccent }}</span>
            </h1>
            <p class="text-section-subtitle">
              {{ hero.description }}
            </p>
          </div>

          <div class="flex flex-wrap gap-6 text-sm">
            <div
              v-for="(stat, index) in hero.stats"
              :key="index"
              class="flex items-center space-x-2 text-secondary"
            >
              <Icon :name="stat.icon" class="text-lg text-primary" />
              <span class="font-medium">{{ stat.label }}</span>
            </div>
          </div>

          <div class="relative max-w-md">
            <Icon
              name="mdi:magnify"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              :id="searchInputId"
              :name="searchInputId"
              :value="modelValue"
              type="text"
              :placeholder="hero.searchPlaceholder"
              class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            />
            <button
              v-if="modelValue"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-touch-44 min-h-touch-44 flex items-center justify-center"
              :aria-label="t('common.clear')"
              @click="$emit('update:modelValue', '')"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="bg-white rounded-3xl shadow-custom p-8">
            <NuxtImg
              :src="heroImage"
              :alt="hero.imageAlt"
              class="w-full h-96 object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
          </div>
          <div class="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="mdi:lightbulb-on-outline" class="text-blue-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-secondary">{{ hero.highlight.title }}</p>
                <p class="text-xs text-gray-500">{{ hero.highlight.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type HeroHighlight = { title: string; subtitle: string }
type HeroStat = { icon: string; label: string }
type HeroContent = {
  title: string
  titleAccent: string
  description: string
  searchPlaceholder: string
  imageAlt: string
  highlight: HeroHighlight
  stats: HeroStat[]
}

defineProps<{
  hero: HeroContent
  heroImage: string
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { t } = useI18n()
const searchInputId = useId()
</script>
