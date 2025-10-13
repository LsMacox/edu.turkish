<template>
  <div>
    <BaseSectionHeader :title="title" />

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
      <div
        v-for="week in weeks"
        :key="week.number"
        class="bg-gray-50 rounded-lg p-6 border border-gray-200"
      >
        <div class="flex items-center gap-3 mb-3">
          <div
            class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold"
          >
            {{ week.number }}
          </div>
          <h3 class="font-semibold text-lg">{{ unitLabel }} {{ week.number }}</h3>
        </div>
        <p class="text-gray-700">{{ week.activities }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix, TimelineWeek } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
  unit?: 'week' | 'day' | 'phase'
}

const props = withDefaults(defineProps<Props>(), {
  unit: 'week',
})

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const unitLabel = computed(() => {
  const labels = {
    week: t('services.common.week', 'Week'),
    day: t('services.common.day', 'Day'),
    phase: t('services.common.phase', 'Phase'),
  }
  return labels[props.unit]
})

const weeks = computed(() => {
  const rawWeeks = (tm(`${props.keyPrefix}.weeks`) || []) as Array<Record<string, unknown>>
  return rawWeeks.map((week, index) => {
    const numberFromData = typeof week?.number === 'number' ? (week.number as number) : undefined
    return {
      number: numberFromData ?? index + 1,
      activities: t(`${props.keyPrefix}.weeks.${index}.activities`) as string,
    } as TimelineWeek
  })
})
</script>
