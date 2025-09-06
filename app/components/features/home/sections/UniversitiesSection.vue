<template>
  <section id="universities" class="py-16 bg-gray-50">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ t('home.universities.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.universities.subtitle') }}</p>
      </div>

      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          @click="selectCity('ALL_CITIES')"
          :class="[
            'px-6 py-2 rounded-xl font-medium transition-all',
            selectedCity === 'ALL_CITIES' 
              ? 'bg-primary text-white' 
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary'
          ]"
        >
          {{ t('home.universities.all_cities') }}
        </button>
        <button 
          v-for="city in mainCities"
          :key="city.code"
          @click="selectCity(getCityLabel(city.code))"
          :class="[
            'px-6 py-2 rounded-xl font-medium transition-all',
            selectedCity === getCityLabel(city.code)
              ? 'bg-primary text-white' 
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary'
          ]"
        >
          {{ getCityLabel(city.code) }}
        </button>
        <button 
          @click="toggleEnglishFilter"
          :class="[
            'px-6 py-2 rounded-xl font-medium transition-all',
            englishOnly 
              ? 'bg-primary text-white' 
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary'
          ]"
        >
          {{ t('home.universities.english_language') }}
        </button>
        <button 
          @click="toggleBudgetFilter"
          :class="[
            'px-6 py-2 rounded-xl font-medium transition-all',
            budgetOnly 
              ? 'bg-primary text-white' 
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary'
          ]"
        >
          {{ t('home.universities.budget_filter') }}
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UniversityCard
          v-for="university in displayedUniversities"
          :key="university.id"
          :title="university.title"
          :city="university.city"
          :languages="university.languages"
          :tuition="university.tuitionRange?.min"
          :badge="university.badge"
          :image="university.image"
          :type="university.type"
          :slug="university.slug"
        />
      </div>

      <div class="text-center mt-12">
        <NuxtLink :to="localePath('/universities')" class="inline-block bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all">
          {{ t('home.universities.view_all') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'

const universitiesStore = useUniversitiesStore()
const { universities } = storeToRefs(universitiesStore)
const { t, locale } = useI18n()
const localePath = useLocalePath()

// SSR: fetch on every request (limit to 6 for home)
if (import.meta.server) {
  await universitiesStore.initAndFetchSSR({ limit: 6, overrides: {} })
}

// CSR fallback: in case SSR state wasn't hydrated
onMounted(async () => {
  if (!universities.value || universities.value.length === 0) {
    await universitiesStore.fetchUniversities({ limit: 6, overrides: {} })
  }
})

// Use constant values for internal state to avoid translation issues
const selectedCity = ref('ALL_CITIES')
const englishOnly = ref(false)
const budgetOnly = ref(false)

// Stable city codes for UI; labels resolved via i18n
const mainCities = [
  { code: 'istanbul' },
  { code: 'ankara' },
  { code: 'izmir' }
]

// Resolve translated city label by code from universities page dictionary
function getCityLabel(code: string) {
  return t(`universities_page.filters.cities.${code}`)
}

const displayedUniversities = computed(() => {
  // API already returns filtered list with limit=6; keep slice as safety
  return universities.value.slice(0, 6)
})

function buildOverrides() {
  const overrides: any = {}
  if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
    overrides.city = selectedCity.value
  }
  if (englishOnly.value) {
    // Language codes in DB are lower-case (e.g., 'en')
    overrides.langs = ['en']
  }
  if (budgetOnly.value) {
    overrides.price = [0, 5000]
  }
  return overrides
}

watch([selectedCity, englishOnly, budgetOnly], async () => {
  await universitiesStore.fetchUniversities({ limit: 6, overrides: buildOverrides() })
})

// When locale changes, update selectedCity if it was a specific city so label switches
watch(() => locale.value, async () => {
  if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
    // Map current selection back to code by comparing old label candidates, then relabel
    const possibleCodes = mainCities.map(c => c.code)
    // Try to find a code whose previous label matched old selection is complex; instead, rebuild using current locale labels.
    // Since we only use 3 main cities, remap by checking if selected city is one of previous labels across locales is not reliable here.
    // Use heuristic: keep the same position if selected among mainCities.
    const currentIndex = mainCities.findIndex(c => getCityLabel(c.code) === selectedCity.value)
    if (currentIndex >= 0) {
      selectedCity.value = getCityLabel(mainCities[currentIndex].code)
    }
  }
  await universitiesStore.fetchUniversities({ limit: 6, overrides: buildOverrides() })
})

const selectCity = (city: string) => {
  selectedCity.value = city
}

const toggleEnglishFilter = () => {
  englishOnly.value = !englishOnly.value
}

const toggleBudgetFilter = () => {
  budgetOnly.value = !budgetOnly.value
}
</script>
