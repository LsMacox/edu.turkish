<template>
  <section id="universities" v-scroll-reveal class="section-py bg-gray-50">
    <div class="container">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
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
          {{ t(ns('all_cities')) }}
        </button>
        <button
          v-for="city in mainCities"
          :key="city.code"
          :class="[
            'px-4 py-2 text-sm rounded-xl font-medium transition-all md:px-6 md:text-base',
            selectedCity === city.label
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary',
          ]"
          @click="selectCity(city.label)"
        >
          {{ city.label }}
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
          {{ t(ns('english_language')) }}
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
          {{ t(ns('budget_filter')) }}
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UniversitiesListCard
          v-for="(university, index) in displayedUniversities"
          :key="university.id"
          v-scroll-reveal="index * 80"
          :title="university.title"
          :city="university.city"
          :languages="university.languages"
          :tuition="university.tuitionMin"
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
          {{ t(ns('view_all')) }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'
import { namespace } from '~~/lib/i18n'

const universitiesStore = useUniversitiesStore()
const { universities } = storeToRefs(universitiesStore)
const { t, locale } = useI18n()
const localePath = useLocalePath()
const ns = namespace('home.universities')
const citiesNs = namespace('universities.list.filters.cities')

if (import.meta.server) {
  await universitiesStore.initializeFilters({ limit: 6, ssr: true })
}

onMounted(async () => {
  if (!universities.value || universities.value.length === 0) {
    await universitiesStore.fetchUniversities({ limit: 6, overrides: {} })
  }
})

const selectedCity = ref('ALL_CITIES')
const englishOnly = ref(false)
const budgetOnly = ref(false)

const mainCities = computed(() => [
  { code: 'istanbul' as const, label: t(citiesNs('istanbul')) },
  { code: 'ankara' as const, label: t(citiesNs('ankara')) },
  { code: 'izmir' as const, label: t(citiesNs('izmir')) },
])

const displayedUniversities = computed(() => {
  return universities.value.slice(0, 6)
})

function buildOverrides() {
  const overrides: any = {}
  if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
    overrides.city = selectedCity.value
  }
  if (englishOnly.value) {
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

watch(
  () => locale.value,
  async () => {
    if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
      const currentCity = mainCities.value.find((c) => c.label === selectedCity.value)
      if (currentCity) {
        selectedCity.value = currentCity.label
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
