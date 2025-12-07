<template>
  <div class="bg-white min-h-screen">
    <!-- Hero Section -->
    <section class="bg-primary py-12 md:py-16">
      <div class="container mx-auto container-padding-narrow text-center">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {{ t('programs.hero.title') }}
        </h1>
        <p class="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          {{ t('programs.hero.description') }}
        </p>
      </div>
    </section>

    <!-- Loading State -->
    <section v-if="pending" class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div class="rounded-3xl bg-white p-10 text-center shadow-custom">
          <p class="text-lg text-secondary">{{ t('programs.error') }}</p>
        </div>
      </div>
    </section>

    <!-- Programs by Categories -->
    <section v-else class="section-py bg-background">
      <div class="container mx-auto container-padding-narrow">
        <div
          v-if="categories.length === 0"
          class="rounded-3xl bg-white p-10 text-center shadow-custom"
        >
          <p class="text-lg text-secondary">{{ t('programs.empty') }}</p>
        </div>

        <div v-else class="space-y-12 md:space-y-16">
          <div v-for="category in categories" :key="category.key" class="space-y-6">
            <!-- Category Title -->
            <h2 class="text-2xl md:text-3xl font-bold text-secondary">
              {{ category.label }}
            </h2>

            <!-- Programs Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <NuxtLink
                v-for="program in category.programs"
                :key="program.id"
                :to="localePath(`/program/${program.slug}`)"
                class="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <!-- Program Image -->
                <div class="relative aspect-[4/3] overflow-hidden">
                  <NuxtImg
                    v-if="program.image"
                    :src="program.image"
                    :alt="program.imageAlt || program.title"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    format="webp"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Icon name="mdi:school" class="text-4xl text-gray-400" />
                  </div>

                  <!-- Gradient Overlay -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                  />

                  <!-- Content Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 class="text-lg font-semibold mb-1 line-clamp-2">
                      {{ program.title }}
                    </h3>
                    <p class="text-sm text-white/90 flex items-center gap-1">
                      {{ t('programs.learnMore') }}
                      <Icon name="mdi:chevron-double-right" class="text-base" />
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProgramsResponse, ProgramCategoryWithItems } from '~~/server/types/api'

definePageMeta({
  layout: 'default',
  name: 'ProgramsPage',
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t('programs.meta.title'),
  meta: [
    { name: 'description', content: t('programs.meta.description') },
    { property: 'og:title', content: t('programs.meta.title') },
    { property: 'og:description', content: t('programs.meta.description') },
    { property: 'og:type', content: 'website' },
  ],
}))

const { data, pending, error } = await useAsyncData(
  `programs-${locale.value}`,
  () =>
    $fetch<ProgramsResponse>('/api/v1/programs', {
      query: { lang: locale.value },
    }),
  { watch: [locale] },
)

const categories = computed<ProgramCategoryWithItems[]>(() => {
  return data.value?.data ?? []
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
