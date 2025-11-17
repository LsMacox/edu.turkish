<template>
  <UiDisplayFAQ :items="faqs" />
</template>

<script setup lang="ts">
// Blog and FAQ section with accordion functionality
const { t } = useI18n()

const faqs = computed(() => [
  {
    question: t('home.faq.question1'),
    answer: t('home.faq.answer1'),
  },
  {
    question: t('home.faq.question2'),
    answer: t('home.faq.answer2'),
  },
  {
    question: t('home.faq.question3'),
    answer: t('home.faq.answer3'),
  },
  {
    question: t('home.faq.question4'),
    answer: t('home.faq.answer4'),
  },
  {
    question: t('home.faq.question5'),
    answer: t('home.faq.answer5'),
  },
  {
    question: t('home.faq.question6'),
    answer: t('home.faq.answer6'),
  },
])
</script>
