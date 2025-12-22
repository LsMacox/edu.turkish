<template>
  <div class="space-component-md">
    <!-- Main Filters Row -->
    <div class="flex flex-wrap items-end gap-component-md">
      <!-- Search -->
      <div class="flex-1 min-w-[200px] md:min-w-[280px]">
        <label :for="searchFieldId" class="block text-label-sm mb-label">{{
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
        <label :for="cityFieldId" class="block text-label-sm mb-label">{{
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
        <label :for="typeFieldId" class="block text-label-sm mb-label">{{
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
        <label :for="levelFieldId" class="block text-label-sm mb-label">{{
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
      <BaseButton
        size="sm"
        variant="link"
        :icon="showAdvanced ? 'mdi:chevron-up' : 'mdi:tune-variant'"
        class="text-body-sm hover:text-primary list-item-padding"
        @click="showAdvanced = !showAdvanced"
      >
        <span class="hidden sm:inline">{{ showAdvanced ? t(filtersNs('hide_filters')) : t(filtersNs('more_filters')) }}</span>
      </BaseButton>
    </div>

    <!-- Advanced Filters (Collapsible) -->
    <Transition
      enter-active-class="transition-default ease-out"
      enter-from-class="opacity-0 -translate-y-2 max-h-0"
      enter-to-class="opacity-100 translate-y-0 max-h-96"
      leave-active-class="transition-default-fast ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-96"
      leave-to-class="opacity-0 -translate-y-2 max-h-0"
    >
      <div v-show="showAdvanced" class="overflow-hidden">
        <div class="pt-component-sm border-t border-default space-component-md">
          <!-- Language Chips -->
          <div>
            <p class="text-label-sm mb-label">
              {{ t(filtersNs('language_label')) }}
            </p>
            <div v-if="availableLanguageCodes.length" class="flex flex-wrap gap-component-sm ml-2">
              <BaseButton
                v-for="lang in availableLanguageCodes"
                :key="lang"
                variant="chip-pill"
                size="sm"
                :data-active="state.langs.includes(lang) ? 'true' : undefined"
                @click="toggleLang(lang, !state.langs.includes(lang))"
              >
                {{ getLanguageLabel(lang) }}
              </BaseButton>
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
    <div class="flex items-center justify-between pt-component-xs">
      <BaseButton
        size="sm"
        variant="link"
        icon="mdi:refresh"
        @click="reset"
      >
        {{ t(filtersNs('reset_button')) }}
      </BaseButton>
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
