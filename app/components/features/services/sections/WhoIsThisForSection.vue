<template>
  <div>
    <BaseSectionHeader :title="title" />

    <ul class="space-y-4 max-w-3xl mx-auto">
      <li
        v-for="(criterion, index) in criteria"
        :key="index"
        class="flex items-start gap-3 text-lg"
      >
        <Icon name="mdi:check-circle" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <span>{{ criterion }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
  criteria?: string[]
}

const props = defineProps<Props>()

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const criteria = computed(() => {
  if (props.criteria && props.criteria.length > 0) return props.criteria
  const raw = tm(`${props.keyPrefix}.criteria`) as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => t(`${props.keyPrefix}.criteria.${index}`) as string)
})
</script>
