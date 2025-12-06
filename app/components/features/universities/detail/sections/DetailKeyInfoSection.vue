<template>
  <section class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="$t('universityDetail.keyInformation.title')"
        :subtitle="$t('universityDetail.keyInformation.subtitle')"
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
          :title="$t(`universityDetail.keyInformation.${item.key}`)"
          :value="item.value"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/server/types/api/universities'
import { useUniversityFormatters } from '../../composables/useUniversityFormatters'

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t } = useI18n()
const { formatNumber } = useUniversityFormatters()

const infoItems = computed(() => [
  {
    key: 'city',
    icon: 'ph:map-pin',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    value: props.university.city,
  },
  {
    key: 'foundedYear',
    icon: 'ph:calendar',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    value: String(props.university.foundedYear),
  },
  {
    key: 'cost',
    icon: 'ph:currency-dollar',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    value: t('universityDetail.keyInformation.costFrom', { cost: '$' + formatNumber(props.university.tuitionMin) }),
  },
  {
    key: 'languages',
    icon: 'ph:translate',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    value: props.university.languages.join(', '),
  },
  {
    key: 'students',
    icon: 'ph:users',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    value: formatNumber(props.university.totalStudents),
  },
  {
    key: 'accommodation',
    icon: 'ph:house',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    value: props.university.hasAccommodation
      ? t('universityDetail.accommodationValue.has')
      : t('universityDetail.accommodationValue.none'),
  },
  {
    key: 'ranking',
    icon: 'ph:trophy',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    value: props.university.rankingText || t('universityDetail.rankingNotSpecified'),
  },
  {
    key: 'internationalStudents',
    icon: 'ph:globe',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    value: t('universityDetail.internationalCount', { count: props.university.internationalStudents }),
  },
])
</script>
