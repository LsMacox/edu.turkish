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
        <div class="grid grid-cols-3 gap-component-md max-w-xl mx-auto">
          <div class="glass-card p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">{{ totalPrograms }}+</div>
            <p class="text-xs text-body-sm">{{ t(heroNs('stats.programs')) }}</p>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">{{ categories.length }}</div>
            <p class="text-xs text-body-sm">{{ t(heroNs('stats.categories')) }}</p>
          </div>
          <div class="glass-card p-3 text-center">
            <div class="text-xl md:text-2xl font-bold text-primary">100%</div>
            <p class="text-xs text-body-sm">{{ t(heroNs('stats.support')) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Tabs & Programs -->
    <section class="section-py bg-white">
      <div class="container mx-auto container-padding-narrow">
        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-component-lg">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p class="text-meta">{{ t(programsNs('loading')) }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center section-py-xl">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <Icon name="mdi:alert-circle-outline" class="text-4xl text-red-500" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-2">{{ t(programsNs('errorTitle')) }}</h3>
          <p class="text-meta mb-6">{{ t(programsNs('error')) }}</p>
          <BaseButton
            variant="primary"
            size="md"
            @click="() => refresh()"
          >
            {{ t(programsNs('retry')) }}
          </BaseButton>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="text-center section-py-xl">
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
            <div class="flex flex-wrap gap-component-sm justify-center">
              <BaseButton
                v-for="category in categories"
                :key="category.key"
                variant="chip-pill"
                size="sm"
                :icon="getCategoryIcon(category.key)"
                :data-active="activeCategory === category.key ? 'true' : undefined"
                @click="activeCategory = category.key"
              >
                {{ category.label }}
                <span 
                  :class="[
                    'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                    activeCategory === category.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-500'
                  ]"
                >
                  {{ category.programs.length }}
                </span>
              </BaseButton>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-component-lg">
            <article v-for="program in activeCategoryData?.programs" :key="program.id" class="h-full">
              <BaseCard
                :to="localePath(`/program/${program.slug}`)"
                padding="none"
                shadow="md"
                rounded="2xl"
                hover="lift"
                full-height
                class="group"
              >
                <NuxtImg
                  v-if="program.image"
                  :src="program.image"
                  :alt="program.imageAlt || program.title"
                  class="w-full h-card-image object-cover rounded-t-2xl"
                  loading="lazy"
                  format="webp"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  v-else
                  class="w-full h-card-image gradient-placeholder flex items-center justify-center"
                >
                  <Icon name="mdi:school" class="text-5xl text-gray-300" />
                </div>
                <div class="card-padding flex flex-col flex-1">
                  <div class="flex flex-wrap items-center gap-component-sm mb-component-sm text-body-sm text-meta">
                    <span class="badge-category bg-primary/10 text-primary">
                      {{ activeCategoryData?.label }}
                    </span>
                  </div>
                  <h3 class="text-card-title mb-component-sm line-clamp-2">{{ program.title }}</h3>
                  <div class="mt-auto pt-component-xs flex items-center justify-between text-body-sm text-meta">
                    <span class="text-primary font-semibold">
                      {{ t(programsNs('learnMore')) }} →
                    </span>
                  </div>
                </div>
              </BaseCard>
            </article>
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
          <div class="flex flex-col sm:flex-row gap-component-lg justify-center">
            <NuxtLink
              :to="localePath('/universities')"
              class="inline-flex items-center justify-center gap-component-sm px-8 py-4 bg-primary text-white rounded-button font-semibold hover:bg-primary/90 transition-all shadow-card-hover shadow-primary/25 hover:shadow-card-hover hover:shadow-primary/30"
            >
              <Icon name="mdi:school" class="text-xl" />
              {{ t(ctaNs('universities')) }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/')"
              class="inline-flex items-center justify-center gap-component-sm px-8 py-4 bg-white/10 text-white rounded-button font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
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
