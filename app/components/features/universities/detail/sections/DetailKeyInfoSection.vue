<template>
  <section class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="t('universityDetail.keyInformation.title')"
        :subtitle="t('universityDetail.keyInformation.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <UniversitiesDetailInfoCard
          v-for="item in infoItems"
          :key="item.key"
          :icon="item.icon"
          :icon-bg="item.iconBg"
          :icon-color="item.iconColor"
          :title="t(`universityDetail.keyInformation.${item.key}`)"
          :value="item.value"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/server/types/api/universities'
import { useUniversity } from '~/composables/universities/useUniversity'
import { getInfoItemStyle } from '~~/lib/universities/constants'

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t } = useI18n()
const { formatNumber } = useUniversity()

// Info item keys and their value getters
const INFO_ITEMS = [
  { key: 'city', getValue: () => props.university.city },
  { key: 'foundedYear', getValue: () => String(props.university.foundedYear) },
  {
    key: 'cost',
    getValue: () =>
      t('universityDetail.keyInformation.costFrom', {
        cost: '$' + formatNumber(props.university.tuitionMin),
      }),
  },
  { key: 'languages', getValue: () => props.university.languages.join(', ') },
  { key: 'students', getValue: () => formatNumber(props.university.totalStudents) },
  {
    key: 'accommodation',
    getValue: () =>
      props.university.hasAccommodation
        ? t('universityDetail.accommodationValue.has')
        : t('universityDetail.accommodationValue.none'),
  },
  {
    key: 'ranking',
    getValue: () => props.university.rankingText || t('universityDetail.rankingNotSpecified'),
  },
  {
    key: 'internationalStudents',
    getValue: () =>
      t('universityDetail.internationalCount', { count: props.university.internationalStudents }),
  },
] as const

const infoItems = computed(() =>
  INFO_ITEMS.map((item) => {
    const style = getInfoItemStyle(item.key)
    return {
      key: item.key,
      icon: style.icon,
      iconBg: style.iconBg,
      iconColor: style.iconColor,
      value: item.getValue(),
    }
  }),
)
</script>
