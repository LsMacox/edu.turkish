<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/30" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div class="relative container mx-auto container-padding-narrow pt-6 md:pt-8 pb-4">
        <div class="text-center max-w-2xl mx-auto mb-6">
          <h1 class="text-section-title mb-2">
            {{ t(heroNs('title')) }}
            <span class="text-primary">{{ t(heroNs('titleAccent')) }}</span>
          </h1>
          <p class="text-section-subtitle">
            {{ t(heroNs('description')) }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-3 md:gap-4 max-w-xl mx-auto">
          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">{{ totalPrograms }}+</div>
            <p class="text-xs text-gray-600">{{ t(heroNs('stats.programs')) }}</p>
          </div>
          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">{{ categories.length }}</div>
            <p class="text-xs text-gray-600">{{ t(heroNs('stats.categories')) }}</p>
          </div>
          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">100%</div>
            <p class="text-xs text-gray-600">{{ t(heroNs('stats.support')) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Tabs & Programs -->
    <section class="section-py bg-white">
      <div class="container mx-auto container-padding-narrow">
        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p class="text-gray-500">{{ t(programsNs('loading')) }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <Icon name="mdi:alert-circle-outline" class="text-4xl text-red-500" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-2">{{ t(programsNs('errorTitle')) }}</h3>
          <p class="text-gray-500 mb-6">{{ t(programsNs('error')) }}</p>
          <button 
            class="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            @click="() => refresh()"
          >
            {{ t(programsNs('retry')) }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon name="mdi:folder-open-outline" class="text-4xl text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-2">{{ t(programsNs('emptyTitle')) }}</h3>
          <p class="text-gray-500">{{ t(programsNs('empty')) }}</p>
        </div>

        <!-- Programs Content -->
        <div v-else>
          <!-- Category Tabs -->
          <div class="mb-8">
            <div class="flex flex-wrap gap-2 justify-center">
              <button
                v-for="category in categories"
                :key="category.key"
                :class="[
                  'px-3 py-1.5 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center gap-1.5',
                  activeCategory === category.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                ]"
                @click="activeCategory = category.key"
              >
                <Icon :name="getCategoryIcon(category.key)" class="w-4 h-4" />
                <span>{{ category.label }}</span>
                <span 
                  :class="[
                    'px-1.5 py-0.5 text-xs rounded-full',
                    activeCategory === category.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  ]"
                >
                  {{ category.programs.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Active Category Title -->
          <div class="text-center mb-6">
            <h2 class="text-card-title mb-2">
              {{ activeCategoryData?.label }}
            </h2>
            <p class="text-section-subtitle max-w-2xl mx-auto">
              {{ t(programsNs('categorySubtitle'), { count: activeCategoryData?.programs.length }) }}
            </p>
          </div>

          <!-- Programs Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <NuxtLink
              v-for="program in activeCategoryData?.programs"
              :key="program.id"
              :to="localePath(`/program/${program.slug}`)"
              class="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden
                     transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-200"
            >
              <!-- Program Image -->
              <div class="relative aspect-[4/3] overflow-hidden">
                <NuxtImg
                  v-if="program.image"
                  :src="program.image"
                  :alt="program.imageAlt || program.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  format="webp"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Icon name="mdi:school" class="text-5xl text-gray-300" />
                </div>

                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <!-- Hover Action -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Icon name="mdi:arrow-right" class="text-xl text-primary" />
                  </div>
                </div>

                <!-- Category Badge -->
                <div class="absolute top-3 left-3">
                  <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-secondary rounded-full shadow-sm">
                    {{ activeCategoryData?.label }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3 class="text-lg font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {{ program.title }}
                </h3>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-500">{{ t(programsNs('learnMore')) }}</span>
                  <Icon 
                    name="mdi:chevron-right" 
                    class="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" 
                  />
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="!pending && !error && categories.length > 0" class="section-py bg-gradient-to-br from-gray-900 to-gray-800">
      <div class="container mx-auto container-padding-narrow text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            {{ t(ctaNs('title')) }}
          </h2>
          <p class="text-gray-300 mb-8">
            {{ t(ctaNs('description')) }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              :to="localePath('/universities')"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              <Icon name="mdi:school" class="text-xl" />
              {{ t(ctaNs('universities')) }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/')"
              class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Icon name="mdi:message-text" class="text-xl" />
              {{ t(ctaNs('contact')) }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ProgramsResponse, ProgramCategoryWithItems } from '~~/lib/types'
import { namespace } from '~~/lib/i18n'

definePageMeta({
  layout: 'default',
  name: 'ProgramsPage',
})

const programsNs = namespace('programs')
const heroNs = namespace('programs.hero')
const ctaNs = namespace('programs.cta')
const metaNs = namespace('programs.meta')
const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead(() => ({
  title: t(metaNs('title')),
  meta: [
    { name: 'description', content: t(metaNs('description')) },
    { property: 'og:title', content: t(metaNs('title')) },
    { property: 'og:description', content: t(metaNs('description')) },
    { property: 'og:type', content: 'website' },
  ],
}))

const { data, pending, error, refresh } = await useAsyncData(
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

const activeCategory = ref<string>('')

// Set first category as active when data loads
watch(categories, (cats) => {
  if (cats.length > 0 && !activeCategory.value) {
    activeCategory.value = cats[0]!.key
  }
}, { immediate: true })

const activeCategoryData = computed(() => {
  return categories.value.find(c => c.key === activeCategory.value)
})

const totalPrograms = computed(() => {
  return categories.value.reduce((sum, cat) => sum + cat.programs.length, 0)
})

const getCategoryIcon = (key: string): string => {
  const icons: Record<string, string> = {
    bachelor: 'mdi:school-outline',
    master: 'mdi:account-school',
    phd: 'mdi:book-education',
    language: 'mdi:translate',
    preparation: 'mdi:clipboard-text-outline',
    default: 'mdi:folder-outline'
  }
  return icons[key] ?? icons.default!
}
</script>
