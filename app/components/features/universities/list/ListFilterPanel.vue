<template>
  <div class="space-y-4">
    <!-- Main Filters Row -->
    <div class="flex flex-wrap items-end gap-3 md:gap-4">
      <!-- Search -->
      <div class="flex-1 min-w-[200px] md:min-w-[280px]">
        <label :for="searchFieldId" class="block text-xs font-medium text-gray-500 mb-1.5">{{
          t(filtersNs('search_label'))
        }}</label>
        <BaseTextField
          :id="searchFieldId"
          v-model="state.q"
          type="text"
          :placeholder="t(filtersNs('search_placeholder'))"
          icon="mdi:magnify"
        />
      </div>

      <!-- City -->
      <div class="w-full sm:w-auto sm:min-w-[160px]">
        <label :for="cityFieldId" class="block text-xs font-medium text-gray-500 mb-1.5">{{
          t(filtersNs('city_label'))
        }}</label>
        <BaseSelect :id="cityFieldId" v-model="state.city">
          <option :value="CITY_ALL">{{ t(filtersNs('all_cities')) }}</option>
          <option v-for="city in availableFilters.cities" :key="city" :value="city">
            {{ city }}
          </option>
        </BaseSelect>
      </div>

      <!-- Type -->
      <div class="w-full sm:w-auto sm:min-w-[140px]">
        <label :for="typeFieldId" class="block text-xs font-medium text-gray-500 mb-1.5">{{
          t(filtersNs('type_label'))
        }}</label>
        <BaseSelect :id="typeFieldId" v-model="state.type">
          <option :value="TYPE_ALL">{{ t(filtersNs('all_types')) }}</option>
          <option v-for="typeOption in availableFilters.types" :key="typeOption" :value="typeOption">
            {{ getTypeLabel(typeOption) }}
          </option>
        </BaseSelect>
      </div>

      <!-- Level -->
      <div class="w-full sm:w-auto sm:min-w-[140px]">
        <label :for="levelFieldId" class="block text-xs font-medium text-gray-500 mb-1.5">{{
          t(filtersNs('level_label'))
        }}</label>
        <BaseSelect :id="levelFieldId" v-model="state.level">
          <option :value="LEVEL_ALL">{{ t(filtersNs('all_levels')) }}</option>
          <option v-for="level in levelOptions" :key="level.value" :value="level.value">
            {{ level.label }}
          </option>
        </BaseSelect>
      </div>

      <!-- Toggle Advanced Filters -->
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
        @click="showAdvanced = !showAdvanced"
      >
        <Icon :name="showAdvanced ? 'mdi:chevron-up' : 'mdi:tune-variant'" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ showAdvanced ? t(filtersNs('hide_filters')) : t(filtersNs('more_filters')) }}</span>
      </button>
    </div>

    <!-- Advanced Filters (Collapsible) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2 max-h-0"
      enter-to-class="opacity-100 translate-y-0 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-96"
      leave-to-class="opacity-0 -translate-y-2 max-h-0"
    >
      <div v-show="showAdvanced" class="overflow-hidden">
        <div class="pt-4 border-t border-gray-100 space-y-4">
          <!-- Language Chips -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2">
              {{ t(filtersNs('language_label')) }}
            </p>
            <div v-if="availableLanguageCodes.length" class="flex flex-wrap gap-2">
              <button
                v-for="lang in availableLanguageCodes"
                :key="lang"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                  state.langs.includes(lang)
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                @click="toggleLang(lang, !state.langs.includes(lang))"
              >
                {{ getLanguageLabel(lang) }}
              </button>
            </div>
          </div>

          <!-- Price Range -->
          <div class="max-w-xl">
            <BaseRangeSlider
              v-model="priceRange"
              :min="priceRangeBounds[0]"
              :max="priceRangeBounds[1]"
              :step="500"
              :label="t(filtersNs('price_label'))"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Actions -->
    <div class="flex items-center justify-between pt-2">
      <button
        type="button"
        class="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5"
        @click="reset"
      >
        <Icon name="mdi:refresh" class="w-4 h-4" />
        {{ t(filtersNs('reset_button')) }}
      </button>
      <BaseButton variant="primary" size="md" icon="mdi:magnify" @click="apply">
        {{ t(filtersNs('apply_button')) }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CITY_ALL, LEVEL_ALL, TYPE_ALL, useUniversitiesStore } from '~/stores/universities'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { namespace } from '~~/lib/i18n'

const filtersNs = namespace('universities.list.filters')

const { t } = useI18n()
const universitiesStore = useUniversitiesStore()
const { filters, availableFilters } = storeToRefs(universitiesStore)
const { applyFilters } = universitiesStore

const { getTypeLabel, getLevelLabel, getLanguageLabel } = useUniversity()

const searchFieldId = useId()
const cityFieldId = useId()
const typeFieldId = useId()
const levelFieldId = useId()

const showAdvanced = ref(false)

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
  applyFilters({
    q: state.q,
    city: state.city,
    langs: [...state.langs],
    type: state.type,
    level: state.level,
    price: [...priceRange.value] as [number, number],
  })
}
</script>
