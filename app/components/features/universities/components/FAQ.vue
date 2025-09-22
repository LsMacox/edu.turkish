<template>
  <UiDisplayFAQ
    :items="faqs"
    :title="t('universityDetail.faq.title')"
    :subtitle="t('universityDetail.faq.subtitle')"
  />
</template>

<script setup lang="ts">
const { t, tm } = useI18n()

type FaqAnswer = string | { title?: string; items?: string[]; ordered?: boolean }

const resolveAnswer = (path: string): FaqAnswer => {
  const message = tm(path)

  if (typeof message === 'string') {
    return message
  }

  if (message && typeof message === 'object') {
    const record = message as Record<string, unknown>
    const items = Array.isArray(record.items)
      ? record.items.filter((item): item is string => typeof item === 'string')
      : undefined
    const title = typeof record.title === 'string' ? record.title : undefined
    const ordered = typeof record.ordered === 'boolean' ? record.ordered : undefined

    if (title || (items && items.length > 0)) {
      return {
        title,
        items,
        ordered,
      }
    }
  }

  return t(path)
}

const faqs = computed(() => [
  {
    question: t('universityDetail.faq.q1'),
    answer: resolveAnswer('universityDetail.faq.a1'),
  },
  {
    question: t('universityDetail.faq.q2'),
    answer: resolveAnswer('universityDetail.faq.a2'),
  },
  {
    question: t('universityDetail.faq.q3'),
    answer: resolveAnswer('universityDetail.faq.a3'),
  },
  {
    question: t('universityDetail.faq.q4'),
    answer: resolveAnswer('universityDetail.faq.a4'),
  },
  {
    question: t('universityDetail.faq.q5'),
    answer: resolveAnswer('universityDetail.faq.a5'),
  },
  {
    question: t('universityDetail.faq.q6'),
    answer: resolveAnswer('universityDetail.faq.a6'),
  },
  {
    question: t('universityDetail.faq.q7'),
    answer: resolveAnswer('universityDetail.faq.a7'),
  },
  {
    question: t('universityDetail.faq.q8'),
    answer: resolveAnswer('universityDetail.faq.a8'),
  },
  {
    question: t('universityDetail.faq.q9'),
    answer: resolveAnswer('universityDetail.faq.a9'),
  },
])
</script>
