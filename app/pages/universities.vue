<template>
  <main>
    <!-- Page Title Section -->
    <section id="page-title" class="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary mb-4 md:mb-6">{{ $t('universities_page.hero.title') }}</h1>
          <p class="text-base md:text-xl text-gray-600 leading-relaxed">
            {{ $t('universities_page.hero.subtitle') }}
          </p>

          <div class="mt-6 md:mt-8">
            <StatisticsCards />
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section id="filters" class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 lg:px-6 py-4 md:py-6">
        <FilterPanel />
      </div>
    </section>

    <!-- Sorting and Results -->
    <section id="sorting" class="py-4 md:py-6 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <SortBar
          :total="totalUniversities"
          :displayed="sorted.length"
          :sort="sort"
          @update:sort="setSort"
        />
      </div>
    </section>

    <!-- Universities Grid -->
    <section id="universities-grid" class="py-8 md:py-12">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UniversityCard
            v-for="u in paged"
            :key="u.id"
            :title="u.title"
            :city="u.city"
            :languages="u.languages"
            :tuition="u.tuitionRange?.min"
            :badge="u.badge"
            :image="u.image"
            :type="u.type"
            :slug="u.slug"
          />
        </div>

        <div class="text-center mt-8 md:mt-12">
          <button
            class="bg-white border-2 border-primary text-primary px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all min-h-touch-48 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="loadMore"
            :disabled="isLoadingMore || !hasMore"
            v-if="hasMore"
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

    <HowToChooseSection />
    <PopularProgramsSection />
    <ScholarshipsSection />
    <NotFoundSection />
    <CTASection />

    <!-- Application Modal is mounted globally in default layout -->
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useUniversitiesStore } from '~/stores/universities'

// Application modal state
const modalStore = useApplicationModalStore()

// Get route and router for watching URL changes and syncing state
const route = useRoute()
const router = useRouter()

// Use the universities store
const universitiesStore = useUniversitiesStore()

const page = ref(1) // Always start from page 1, ignore URL page parameter
const pageSize = 6
const isLoadingMore = ref(false)

// SSR prefetch: initialize and fetch on server for every request
if (import.meta.server) {
  await universitiesStore.initAndFetchSSR({ limit: pageSize, page: page.value })
}
onMounted(() => {
  universitiesStore.initializeFilters()
})

// Watch for route changes to reinitialize filters (all changes now trigger reset)
watch(
  () => route.query,
  () => {
    // Reset page state when filters change
    page.value = 1
    universitiesStore.initializeFilters()
  },
  { deep: true }
)


const sorted = computed(() => universitiesStore.filteredUniversities)

// Show all universities that have been loaded so far
const paged = computed(() => sorted.value)

// Check if there are more universities to load from the server
const hasMore = computed(() => {
  // Hide button if we're currently loading more
  if (isLoadingMore.value) return false
  
  // Use pagination metadata from server response
  const totalPages = Math.ceil(totalUniversities.value / pageSize)
  return page.value < totalPages
})

async function loadMore() {
  if (isLoadingMore.value) return
  
  // Check if there are more pages using server metadata
  const totalPages = Math.ceil(totalUniversities.value / pageSize)
  if (page.value >= totalPages) {
    return
  }
  
  isLoadingMore.value = true
  
  try {
    const nextPage = page.value + 1
    
    // Fetch more universities from the server with the new page
    const result = await fetchUniversities({ 
      limit: pageSize, 
      page: nextPage 
    })
    
    // Only update page state if we got results
    if (result && result.data && result.data.length > 0) {
      page.value = nextPage
    }
  } finally {
    isLoadingMore.value = false
  }
}

// Destructure store properties for template usage
const { filteredUniversities, filters, sort, totalUniversities } = storeToRefs(universitiesStore)
const { setFilter, setSort, initializeFilters, fetchUniversities } = universitiesStore

// Modal state for template
const modalState = {
  isOpen: computed(() => modalStore.isOpen),
  userPreferences: computed(() => modalStore.userPreferences),
  closeModal: modalStore.closeModal,
  submitApplication: modalStore.submitApplication
}
</script>
