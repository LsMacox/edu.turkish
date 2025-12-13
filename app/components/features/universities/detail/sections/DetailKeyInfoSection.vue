<template>
  <section class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
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
          :title="item.title"
          :value="item.value"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { getInfoItemStyle } from '~~/lib/domain/universities/constants'
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
      iconBg: style.iconBg,
      iconColor: style.iconColor,
    }
  })
})
</script>
