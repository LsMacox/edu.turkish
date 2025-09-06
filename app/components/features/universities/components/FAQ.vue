<template>
  <UiDisplayFAQ
    :items="faqs"
    :title="t('home.faq.universities_title')"
    :subtitle="t('home.faq.universities_subtitle')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const faqs = computed(() => [
  {
    question: t('home.faq.universities.q1'),
    answer: t('home.faq.universities.a1')
  },
  {
    question: t('home.faq.universities.q2'),
    answer: t('home.faq.universities.a2')
  },
  {
    question: t('home.faq.universities.q3'),
    answer: t('home.faq.universities.a3')
  },
  {
    question: t('home.faq.universities.q4'),
    answer: t('home.faq.universities.a4')
  },
  {
    question: t('home.faq.universities.q5'),
    answer: t('home.faq.universities.a5')
  },
  {
    question: t('home.faq.universities.q6'),
    answer: t('home.faq.universities.a6')
  },
  {
    question: t('home.faq.universities.q7'),
    answer: t('home.faq.universities.a7')
  },
  {
    question: t('home.faq.universities.q8'),
    answer: t('home.faq.universities.a8')
  },
  {
    question: t('home.faq.universities.q9'),
    answer: t('home.faq.universities.a9')
  },
  {
    question: t('home.faq.universities.q10'),
    answer: t('home.faq.universities.a10')
  }
])
</script>

