<template>
  <UiDisplayFAQ
    :items="faqs"
    :title="t('home.faq.universities_title')"
    :subtitle="t('home.faq.universities_subtitle')"
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
    question: t('home.faq.universities.q1'),
    answer: resolveAnswer('home.faq.universities.a1'),
  },
  {
    question: t('home.faq.universities.q2'),
    answer: resolveAnswer('home.faq.universities.a2'),
  },
  {
    question: t('home.faq.universities.q3'),
    answer: resolveAnswer('home.faq.universities.a3'),
  },
  {
    question: t('home.faq.universities.q4'),
    answer: resolveAnswer('home.faq.universities.a4'),
  },
  {
    question: t('home.faq.universities.q5'),
    answer: resolveAnswer('home.faq.universities.a5'),
  },
  {
    question: t('home.faq.universities.q6'),
    answer: resolveAnswer('home.faq.universities.a6'),
  },
  {
    question: t('home.faq.universities.q7'),
    answer: resolveAnswer('home.faq.universities.a7'),
  },
  {
    question: t('home.faq.universities.q8'),
    answer: resolveAnswer('home.faq.universities.a8'),
  },
  {
    question: t('home.faq.universities.q9'),
    answer: resolveAnswer('home.faq.universities.a9'),
  },
])
</script>
