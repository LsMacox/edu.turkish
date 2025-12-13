<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon name="mdi:school" class="w-4 h-4 text-primary" />
      </div>
      <p class="text-sm text-gray-600">
        {{ t(sortNs('showing_text')) }}
        <span class="font-semibold text-secondary">{{ displayed }}</span>
        {{ t(sortNs('of_text')) }}
        <span class="font-semibold text-secondary">{{ total }}</span>
        {{ t(sortNs('universities_text')) }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <label :for="sortFieldId" class="text-xs font-medium text-gray-500 whitespace-nowrap">
        {{ t(sortNs('sort_label')) }}
      </label>
      <BaseSelect :id="sortFieldId" :model-value="sort" class="min-w-[160px]" @update:model-value="onUpdateSort">
        <option value="pop">{{ t(sortNs('options.popularity')) }}</option>
        <option value="price_asc">{{ t(sortNs('options.price_asc')) }}</option>
        <option value="price_desc">{{ t(sortNs('options.price_desc')) }}</option>
        <option value="alpha">{{ t(sortNs('options.alphabetical')) }}</option>
        <option value="lang_en">{{ t(sortNs('options.english_first')) }}</option>
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortOption } from '~/stores/universities'
import { SORT_OPTIONS } from '~/stores/universities'
import { namespace } from '~~/lib/i18n'

const sortNs = namespace('universities.list.sort')

defineProps<{ total: number; displayed: number; sort: SortOption }>()
const emit = defineEmits<{ (e: 'update:sort', value: SortOption): void }>()
const { t } = useI18n()

const sortFieldId = useId()

const onUpdateSort = (value: string) => {
  if ((SORT_OPTIONS as readonly string[]).includes(value)) {
    emit('update:sort', value as SortOption)
  }
}
</script>
