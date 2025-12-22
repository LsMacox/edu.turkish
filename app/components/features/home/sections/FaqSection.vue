<template>
  <DisplayFAQ class="section-py-xl" :items="faqs" :title="t(faqNs('title'))" :subtitle="t(faqNs('subtitle'))" />
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

// Blog and FAQ section with accordion functionality
const faqNs = namespace('home.faq')
const { t } = useI18n()

const faqs = computed(() => [
  {
    question: t(faqNs('question1')),
    answer: t(faqNs('answer1')),
  },
  {
    question: t(faqNs('question2')),
    answer: t(faqNs('answer2')),
  },
  {
    question: t(faqNs('question3')),
    answer: t(faqNs('answer3')),
  },
  {
    question: t(faqNs('question4')),
    answer: t(faqNs('answer4')),
  },
  {
    question: t(faqNs('question5')),
    answer: t(faqNs('answer5')),
  },
  {
    question: t(faqNs('question6')),
    answer: t(faqNs('answer6')),
  },
])

useFaqSchema(faqs)
</script>
