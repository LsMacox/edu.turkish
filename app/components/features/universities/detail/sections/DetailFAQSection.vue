<template>
  <UiDisplayFAQ
    class="py-16"
    :items="faqs"
    :title="t(ns('title'))"
    :subtitle="t(ns('subtitle'))"
  />
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const ns = namespace('universities.detail.faq')
const { t } = useI18n()

const faqs = computed(() => [
  {
    question: t(ns('q1')),
    answer: t(ns('a1')),
  },
  {
    question: t(ns('q2')),
    answer: t(ns('a2')),
  },
  {
    question: t(ns('q3')),
    answer: t(ns('a3')),
  },
  {
    question: t(ns('q4')),
    answer: t(ns('a4')),
  },
  {
    question: t(ns('q5')),
    answer: t(ns('a5')),
  },
  {
    question: t(ns('q6')),
    answer: t(ns('a6')),
  },
  {
    question: t(ns('q7')),
    answer: t(ns('a7')),
  },
  {
    question: t(ns('q8')),
    answer: t(ns('a8')),
  },
  {
    question: t(ns('q9')),
    answer: t(ns('a9')),
  },
])

useFaqSchema(faqs)
</script>
