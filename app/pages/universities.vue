<template>
  <main>
    <!-- Hero Section with gradient background -->
    <section id="page-title" class="relative overflow-hidden">
      <!-- Background with subtle pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/30"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div class="relative container mx-auto container-padding-narrow pt-6 md:pt-8 pb-4">
        <div class="text-center max-w-2xl mx-auto">
          <h1 class="text-section-title mb-2">
            {{ t(heroNs('title')) }}
          </h1>
          <p class="text-section-subtitle mb-4">
            {{ t(heroNs('subtitle')) }}
          </p>
          <UniversitiesListStatisticsCards />
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section id="filters" class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 lg:px-6 py-4">
        <UniversitiesListFilterPanel />
      </div>
    </section>

    <!-- Results Section -->
    <section id="universities-results" class="bg-gray-50/50">
      <div class="container mx-auto container-padding-narrow section-py-sm">
        <!-- Sort Bar -->
        <div class="mb-6">
          <UniversitiesListSortBar
            :total="totalUniversities"
            :displayed="sorted.length"
            :sort="sort"
            @update:sort="setSort"
          />
        </div>

        <!-- Universities Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-component-lg">
          <UniversitiesListCard
            v-for="u in paged"
            :key="u.id"
            :title="u.title"
            :city="u.city"
            :languages="u.languages"
            :tuition="u.tuitionMin"
            :badge="u.badge"
            :image="u.image"
            :type="u.type"
            :slug="u.slug"
          />
        </div>

        <div class="text-center mt-8 md:mt-12">
          <BaseButton
            v-if="hasMore"
            variant="outline"
            size="lg"
            :loading="isLoadingMore"
            :disabled="!hasMore"
            @click="loadMore"
          >
            {{ t(listNs('load_more')) }}
          </BaseButton>
        </div>
      </div>
    </section>

    <UniversitiesListHowToChooseSection />
    <UniversitiesListScholarshipsSection />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { namespace } from '~~/lib/i18n'
import { useUniversitiesStore } from '~/stores/universities'

const listNs = namespace('universities.list')
const heroNs = namespace('universities.list.hero')
const metaNs = namespace('universities.meta')

const { t } = useI18n()
const localePath = useLocalePath()
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

useSeoMeta({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
  keywords: () => t(metaNs('keywords')),
  ogTitle: () => t(metaNs('title')),
  ogDescription: () => t(metaNs('description')),
  ogType: 'website',
  twitterTitle: () => t(metaNs('title')),
  twitterDescription: () => t(metaNs('description')),
})

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: t(metaNs('title')),
        description: t(metaNs('description')),
        url: `${siteUrl}${localePath('/universities')}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Edu.turkish',
          url: siteUrl,
        },
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t(metaNs('title')),
            item: `${siteUrl}${localePath('/universities')}`,
          },
        ],
      }),
    },
  ],
}))
const route = useRoute()

const universitiesStore = useUniversitiesStore()

const page = ref(1)
const pageSize = 6
const isLoadingMore = ref(false)

if (import.meta.server) {
  await universitiesStore.initializeFilters({ limit: pageSize, page: page.value, ssr: true })
}
onMounted(() => {
  universitiesStore.initializeFilters()
})

watch(
  () => route.query,
  () => {
    page.value = 1
    universitiesStore.initializeFilters()
  },
  { deep: true },
)

const sorted = computed(() => universitiesStore.universities)

const paged = computed(() => sorted.value)

const hasMore = computed(() => {
  if (isLoadingMore.value) return false

  const totalPages = Math.ceil(totalUniversities.value / pageSize)
  return page.value < totalPages
})

async function loadMore() {
  if (isLoadingMore.value) return

  const totalPages = Math.ceil(totalUniversities.value / pageSize)
  if (page.value >= totalPages) {
    return
  }

  isLoadingMore.value = true

  try {
    const nextPage = page.value + 1

    const result = await fetchUniversities({
      limit: pageSize,
      page: nextPage,
    })

    if (result && result.data && result.data.length > 0) {
      page.value = nextPage
    }
  } finally {
    isLoadingMore.value = false
  }
}

const { sort, totalUniversities } = storeToRefs(universitiesStore)
const { setSort, fetchUniversities } = universitiesStore
</script>
