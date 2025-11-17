<template>
  <section id="universities" v-scroll-reveal class="section-py bg-gray-50">
    <div class="container">
      <BaseSectionHeader
        :title="t('home.universities.title')"
        :subtitle="t('home.universities.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="flex flex-wrap justify-center gap-3 mb-10 md:gap-4 md:mb-12">
        <button
          :class="[
            'px-4 py-2 text-sm rounded-xl font-medium transition-all md:px-6 md:text-base',
            selectedCity === 'ALL_CITIES'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary',
          ]"
          @click="selectCity('ALL_CITIES')"
        >
          {{ t('home.universities.all_cities') }}
        </button>
        <button
          v-for="city in mainCities"
          :key="city.code"
          :class="[
            'px-4 py-2 text-sm rounded-xl font-medium transition-all md:px-6 md:text-base',
            selectedCity === getCityLabel(city.code)
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary',
          ]"
          @click="selectCity(getCityLabel(city.code))"
        >
          {{ getCityLabel(city.code) }}
        </button>
        <button
          :class="[
            'px-4 py-2 text-sm rounded-xl font-medium transition-all md:px-6 md:text-base',
            englishOnly
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary',
          ]"
          @click="toggleEnglishFilter"
        >
          {{ t('home.universities.english_language') }}
        </button>
        <button
          :class="[
            'px-4 py-2 text-sm rounded-xl font-medium transition-all md:px-6 md:text-base',
            budgetOnly
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary',
          ]"
          @click="toggleBudgetFilter"
        >
          {{ t('home.universities.budget_filter') }}
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UniversitiesUniversityCard
          v-for="(university, index) in displayedUniversities"
          :key="university.id"
          v-scroll-reveal="index * 80"
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
        <NuxtLink
          :to="localePath('/universities')"
          class="inline-block bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
        >
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
const mainCities = [{ code: 'istanbul' }, { code: 'ankara' }, { code: 'izmir' }]

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
watch(
  () => locale.value,
  async () => {
    if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
      const currentIndex = mainCities.findIndex((c) => getCityLabel(c.code) === selectedCity.value)
      if (currentIndex >= 0) {
        const found = mainCities[currentIndex]
        if (found) {
          selectedCity.value = getCityLabel(found.code)
        }
      }
    }
    await universitiesStore.fetchUniversities({ limit: 6, overrides: buildOverrides() })
  },
)

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
