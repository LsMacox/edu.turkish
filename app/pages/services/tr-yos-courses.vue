<template>
  <ServicesPageLayout
    :title="t(svc('title'))"
    :subtitle="t(svc('subtitle'))"
  >
    <template #sub-services>
      <ServicesServiceCard
        v-for="sub in subServices"
        :key="sub.name"
        :service-name="sub.name"
        :name="sub.name"
        :description="sub.description"
        :price-usd="sub.priceUsd"
        @apply="handleApply"
      />
    </template>

    <template #course-goal>
      <ServicesCoursesGoalSection
        :title="goalData.title"
        :description="goalData.description"
        :packages="goalData.packages"
      />
    </template>

    <template #program-content>
      <ServicesCoursesContentSection
        :title="programContentData.title"
        :items="programContentData.items"
      />
    </template>

    <template #format-schedule>
      <ServicesCoursesFormatSection :data="formatScheduleData" />
    </template>

    <template #student-results>
      <ServicesCoursesResultsSection :data="resultsData" />
    </template>

    <template #faq>
      <ServicesFAQ
        :title="faqData.title"
        :items="faqData.items"
      />
    </template>
  </ServicesPageLayout>
</template>

<script setup lang="ts">
import { useExchangeRatesStore } from '~/stores/exchangeRates'
import { useServiceHead } from '~/composables/useServiceHead'
import { namespace } from '~~/lib/i18n'

const svc = namespace('services.tr-yos-courses')
const metaNs = namespace('services.tr-yos-courses.meta')
const subSvcNs = namespace('services.tr-yos-courses.subServices')
const formatNs = namespace('services.tr-yos-courses.formatSchedule')
const goalNs = namespace('services.tr-yos-courses.courseGoal')
const contentNs = namespace('services.tr-yos-courses.programContent')
const resultsNs = namespace('services.tr-yos-courses.studentResults')
const faqNs = namespace('services.tr-yos-courses.faq')
const faqItemsNs = namespace('services.tr-yos-courses.faq.items')
const { t } = useI18n()
const modal = useApplicationModal()
const exchangeRatesStore = useExchangeRatesStore()

onMounted(() => exchangeRatesStore.ensureFresh())

const subServices = computed(() => [
  {
    name: t(subSvcNs('basic.name')),
    description: t(subSvcNs('basic.description')),
    priceUsd: 300,
  },
  {
    name: t(subSvcNs('individual.name')),
    description: t(subSvcNs('individual.description')),
    priceUsd: 700,
  },
])

const handleApply = ({ name }: { serviceName: string; name: string }) => {
  modal.openModal({
    source: 'service_page',
    description: name,
  })
}

useServiceHead({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
  schemaType: ['Course'],
})
const formatScheduleData = computed(() => ({
  title: t(formatNs('title')),
  items: [
    {
      key: 'format',
      label: t(formatNs('labels.format')),
      value: t(formatNs('format')),
    },
    {
      key: 'recordings',
      label: t(formatNs('labels.recordings')),
      value: t(formatNs('recordings')),
    },
    {
      key: 'platform',
      label: t(formatNs('labels.platform')),
      value: t(formatNs('platform')),
    },
    {
      key: 'support',
      label: t(formatNs('labels.support')),
      value: t(formatNs('support')),
    },
  ],
}))

const { getOptional } = useI18nHelpers()

const goalData = computed(() => ({
  title: t(goalNs('title')),
  description: getOptional(goalNs('description')),
  packages: [
    {
      name: t(goalNs('packages.basic.name')),
      targetScore: t(goalNs('packages.basic.targetScore')),
    },
    {
      name: t(goalNs('packages.individual.name')),
      targetScore: t(goalNs('packages.individual.targetScore')),
    },
  ],
}))

const programContentData = computed(() => ({
  title: t(contentNs('title')),
  items: [
    {
      title: t(contentNs('items.theory.title')),
      description: t(contentNs('items.theory.description')),
      icon: t(contentNs('items.theory.icon')),
    },
    {
      title: t(contentNs('items.practice.title')),
      description: t(contentNs('items.practice.description')),
      icon: t(contentNs('items.practice.icon')),
    },
    {
      title: t(contentNs('items.errorAnalysis.title')),
      description: t(contentNs('items.errorAnalysis.description')),
      icon: t(contentNs('items.errorAnalysis.icon')),
    },
    {
      title: t(contentNs('items.materials.title')),
      description: t(contentNs('items.materials.description')),
      icon: t(contentNs('items.materials.icon')),
    },
  ],
}))

const resultsData = computed(() => ({
  title: t(resultsNs('title')),
  maxResults: [
    {
      package: t(resultsNs('maxResults.individual.package')),
      score: t(resultsNs('maxResults.individual.score')),
    },
    {
      package: t(resultsNs('maxResults.group.package')),
      score: t(resultsNs('maxResults.group.score')),
    },
  ],
}))

const faqData = computed(() => ({
  title: t(faqNs('title')),
  items: [
    {
      question: t(faqItemsNs('difference.question')),
      answer: t(faqItemsNs('difference.answer')),
    },
    {
      question: t(faqItemsNs('duration.question')),
      answer: t(faqItemsNs('duration.answer')),
    },
    {
      question: t(faqItemsNs('trial.question')),
      answer: t(faqItemsNs('trial.answer')),
    },
    {
      question: t(faqItemsNs('content.question')),
      answer: t(faqItemsNs('content.answer')),
    },
    {
      question: t(faqItemsNs('missed_lesson.question')),
      answer: t(faqItemsNs('missed_lesson.answer')),
    },
    {
      question: t(faqItemsNs('score.question')),
      answer: t(faqItemsNs('score.answer')),
    },
    {
      question: t(faqItemsNs('online.question')),
      answer: t(faqItemsNs('online.answer')),
    },
  ],
}))
</script>
