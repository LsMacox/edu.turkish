<template>
  <main>
    <!-- Page Title Section -->
    <section id="page-title" class="section-py bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="container mx-auto container-padding-narrow">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-hero mb-4 md:mb-6">
            {{ $t('universities_page.hero.title') }}
          </h1>
          <p class="text-hero-subtitle">
            {{ $t('universities_page.hero.subtitle') }}
          </p>

          <div class="mt-6 md:mt-8">
            <UniversitiesListStatisticsCards />
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section id="filters" class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 lg:px-6 py-4 md:py-6">
        <UniversitiesListFilterPanel />
      </div>
    </section>

    <!-- Sorting and Results -->
    <section id="sorting" class="py-4 md:py-6 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <UniversitiesListSortBar
          :total="totalUniversities"
          :displayed="sorted.length"
          :sort="sort"
          @update:sort="setSort"
        />
      </div>
    </section>

    <!-- Universities Grid -->
    <section id="universities-grid" class="section-py-sm">
      <div class="container mx-auto container-padding-narrow">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-section">
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
          <button
            v-if="hasMore"
            class="bg-white border-2 border-primary text-primary px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all min-h-touch-48 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoadingMore || !hasMore"
            @click="loadMore"
          >
            <span v-if="isLoadingMore" class="flex items-center gap-2">
              <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
              {{ $t('universities_page.loading') }}
            </span>
            <span v-else>
              {{ $t('universities_page.load_more') }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <UniversitiesListHowToChooseSection />
    <UniversitiesListPopularProgramsSection />
    <UniversitiesListScholarshipsSection />
    <UniversitiesListNotFoundSection />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

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
