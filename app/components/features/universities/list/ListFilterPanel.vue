<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 items-start">
    <!-- Search -->
    <div class="md:col-span-2 lg:col-span-2">
      <label :for="searchFieldId" class="block text-sm font-medium text-secondary mb-2">{{
        t('universities_page.filters.search_label')
      }}</label>
      <BaseTextField
        :id="searchFieldId"
        v-model="state.q"
        type="text"
        :placeholder="t('universities_page.filters.search_placeholder')"
        icon="mdi:magnify"
      />
    </div>

    <!-- City -->
    <div class="md:col-span-1 lg:col-span-1">
      <label :for="cityFieldId" class="block text-sm font-medium text-secondary mb-2">{{
        t('universities_page.filters.city_label')
      }}</label>
      <BaseSelect :id="cityFieldId" v-model="state.city">
        <option :value="CITY_ALL">{{ t('universities_page.filters.all_cities') }}</option>
        <option v-for="city in availableFilters.cities" :key="city" :value="city">
          {{ city }}
        </option>
      </BaseSelect>
    </div>

    <!-- Language -->
    <div class="md:col-span-1 lg:col-span-1">
      <fieldset class="p-0 m-0 border-0">
        <legend class="block text-sm font-medium text-secondary mb-2">
          {{ t('universities_page.filters.language_label') }}
        </legend>
        <div v-if="availableLanguageCodes.length" class="space-y-2">
          <BaseCheckbox
            v-for="lang in availableLanguageCodes"
            :key="lang"
            :checked="state.langs.includes(lang)"
            :value="lang"
            @update:checked="toggleLang(lang, $event)"
          >
            {{ getLanguageLabel(lang) }}
          </BaseCheckbox>
        </div>
      </fieldset>
    </div>

    <!-- Type -->
    <div class="md:col-span-1 lg:col-span-1">
      <label :for="typeFieldId" class="block text-sm font-medium text-secondary mb-2">{{
        t('universities_page.filters.type_label')
      }}</label>
      <BaseSelect :id="typeFieldId" v-model="state.type">
        <option :value="TYPE_ALL">{{ t('universities_page.filters.all_types') }}</option>
        <option v-for="typeOption in availableFilters.types" :key="typeOption" :value="typeOption">
          {{ getTypeLabel(typeOption) }}
        </option>
      </BaseSelect>
    </div>

    <!-- Level -->
    <div class="md:col-span-1 lg:col-span-1">
      <label :for="levelFieldId" class="block text-sm font-medium text-secondary mb-2">{{
        t('universities_page.filters.level_label')
      }}</label>
      <BaseSelect :id="levelFieldId" v-model="state.level">
        <option :value="LEVEL_ALL">{{ t('universities_page.filters.all_levels') }}</option>
        <option v-for="level in levelOptions" :key="level.value" :value="level.value">
          {{ level.label }}
        </option>
      </BaseSelect>
    </div>

    <!-- Price Range -->
    <div class="md:col-span-2 lg:col-span-6">
      <BaseRangeSlider
        v-model="priceRange"
        :min="priceRangeBounds[0]"
        :max="priceRangeBounds[1]"
        :step="500"
        :label="t('universities_page.filters.price_label')"
      />
    </div>

    <!-- Actions -->
    <div class="md:col-span-2 lg:col-span-6 flex flex-col sm:flex-row justify-end gap-3 pt-4">
      <button
        class="bg-gray-100 text-secondary px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 sm:w-auto"
        @click="reset"
      >
        <Icon name="mdi:refresh" class="w-4 h-4" />
        {{ t('universities_page.filters.reset_button') }}
      </button>
      <button
        class="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 sm:w-auto"
        @click="apply"
      >
        <Icon name="mdi:filter" class="w-4 h-4" />
        {{ t('universities_page.filters.apply_button') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CITY_ALL, LEVEL_ALL, TYPE_ALL, useUniversitiesStore } from '~/stores/universities'
import { useUniversity } from '~/composables/universities/useUniversity'

const emit = defineEmits<{
  apply: [
    payload: {
      q: string
      city: string
      langs: string[]
      type: string
      level: string
      price: [number, number]
    },
  ]
}>()

const { t } = useI18n()
const universitiesStore = useUniversitiesStore()
const { filters, availableFilters } = storeToRefs(universitiesStore)
const { applyFilters } = universitiesStore

const { getTypeLabel, getLevelLabel, getLanguageLabel } = useUniversity()

const searchFieldId = useId()
const cityFieldId = useId()
const typeFieldId = useId()
const levelFieldId = useId()

const state = reactive({
  q: '',
  city: CITY_ALL,
  langs: [] as string[],
  type: TYPE_ALL,
  level: LEVEL_ALL,
})

const availableLanguageCodes = computed(() => {
  const languages = availableFilters.value.languages ?? []
  return [...new Set(languages.map((l) => l.toUpperCase()).filter(Boolean))]
})

const priceRangeBounds = computed<[number, number]>(() => {
  const [min, max] = availableFilters.value.priceRange
  return [min, max]
})

const priceRange = ref<[number, number]>([...priceRangeBounds.value])

const levelOptions = computed(() =>
  (availableFilters.value.levels ?? []).map((level) => ({
    value: level,
    label: getLevelLabel(level),
  })),
)

const syncFromFilters = () => {
  state.q = filters.value.q
  state.city = filters.value.city || CITY_ALL
  state.type = filters.value.type || TYPE_ALL
  state.level = filters.value.level || LEVEL_ALL

  const availableSet = new Set(availableLanguageCodes.value)
  state.langs = filters.value.langs
    .map((l) => l.toUpperCase())
    .filter((l) => !availableSet.size || availableSet.has(l))

  const price = filters.value.price?.length === 2 ? filters.value.price : priceRangeBounds.value
  priceRange.value = [price[0], price[1]]
}

onMounted(syncFromFilters)

watch(() => filters.value, syncFromFilters, { deep: true })

watch(availableLanguageCodes, (codes) => {
  if (!codes.length) return
  const filtered = state.langs.filter((l) => codes.includes(l))
  if (filtered.length !== state.langs.length) {
    state.langs = filtered
  }
})

watch(priceRangeBounds, ([min, max]) => {
  const [curMin, curMax] = priceRange.value
  const boundedMin = Math.max(min, Math.min(curMin, max))
  const boundedMax = Math.min(max, Math.max(curMax, min))
  if (boundedMin !== curMin || boundedMax !== curMax) {
    priceRange.value = [boundedMin, boundedMax]
  }
})

const toggleLang = (lang: string, checked: boolean) => {
  const normalized = lang.toUpperCase()
  if (checked && !state.langs.includes(normalized)) {
    state.langs = [...state.langs, normalized]
  } else if (!checked) {
    state.langs = state.langs.filter((l) => l !== normalized)
  }
}

const reset = () => {
  Object.assign(state, { q: '', city: CITY_ALL, langs: [], type: TYPE_ALL, level: LEVEL_ALL })
  priceRange.value = [...priceRangeBounds.value]
  apply()
}

const apply = () => {
  const payload = {
    q: state.q,
    city: state.city,
    langs: [...state.langs],
    type: state.type,
    level: state.level,
    price: [...priceRange.value] as [number, number],
  }
  applyFilters(payload)
  emit('apply', payload)
}
</script>
