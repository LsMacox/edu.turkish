<template>
  <BaseSection padding="md" bg="white">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <BaseGrid :cols="2" :md="3" :lg="4" gap="sm">
        <UniversitiesDetailInfoCard
          v-for="item in infoItems"
          :key="item.key"
          :icon="item.icon"
          :color="item.color"
          :title="item.title"
          :value="item.value"
        />
      </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { getInfoItemStyle } from '~/composables/domain'
import { namespace } from '~~/lib/i18n'

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t } = useI18n()
const ns = namespace('universities.detail.keyInformation')
const nsRoot = namespace('universities.detail')
const { formatNumber } = useUniversity()

const infoItems = computed(() => {
  const items = [
    {
      key: 'city',
      title: t(ns('city')),
      value: props.university.city,
    },
    {
      key: 'foundedYear',
      title: t(ns('foundedYear')),
      value: String(props.university.foundedYear),
    },
    {
      key: 'cost',
      title: t(ns('cost')),
      value: t(ns('costFrom'), {
        cost: '$' + formatNumber(props.university.tuitionMin),
      }),
    },
    {
      key: 'languages',
      title: t(ns('languages')),
      value: props.university.languages.join(', '),
    },
    {
      key: 'students',
      title: t(ns('students')),
      value: formatNumber(props.university.totalStudents),
    },
    {
      key: 'accommodation',
      title: t(ns('accommodation')),
      value: props.university.hasAccommodation
        ? t(nsRoot('accommodationValue.has'))
        : t(nsRoot('accommodationValue.none')),
    },
    {
      key: 'ranking',
      title: t(ns('ranking')),
      value: props.university.rankingText || t(nsRoot('rankingNotSpecified')),
    },
    {
      key: 'internationalStudents',
      title: t(ns('internationalStudents')),
      value: t(nsRoot('internationalCount'), { count: props.university.internationalStudents }),
    },
  ]

  return items.map((item) => {
    const style = getInfoItemStyle(item.key)
    return {
      ...item,
      icon: style.icon,
      color: style.color,
    }
  })
})
</script>
