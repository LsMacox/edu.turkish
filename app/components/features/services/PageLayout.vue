<template>
  <div class="container section-py">
    <!-- Breadcrumbs -->
    <BaseBreadcrumbs :items="breadcrumbItems" class="mb-component-lg" />

    <!-- Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" title-tag="h1" />

    <!-- Sub-Services Grid -->
    <div v-if="$slots['sub-services']" :class="['grid gap-component-lg mt-section', subServicesCols]">
      <slot name="sub-services" />
    </div>

    <!-- Service Cards -->
    <div v-if="$slots['service-cards']" class="mt-component-lg">
      <slot name="service-cards" />
    </div>

    <!-- All content sections with consistent spacing -->
    <template v-for="name in sectionSlots" :key="name">
      <div v-if="$slots[name]" class="mt-section">
        <slot :name="name" />
      </div>
    </template>

    <!-- Final CTA -->
    <div v-if="$slots['final-cta']" class="mt-section">
      <slot name="final-cta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/shared/BaseBreadcrumbs.vue'
import { namespace } from '~~/lib/i18n'

interface Props {
  title: string
  subtitle?: string
  subServicesCols?: string
  breadcrumbLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  subServicesCols: 'md:grid-cols-2 lg:grid-cols-3',
})

const ns = namespace('breadcrumbs')
const { t } = useI18n()

const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { label: t(ns('services')), path: '/#services' },
  { label: props.breadcrumbLabel || props.title },
])

// All content section slots in display order
const sectionSlots = [
  'course-goal',
  'program-content',
  'format-schedule',
  'student-results',
  'teachers',
  'price-calculator',
  'how-it-works',
  'why-choose-us',
  'faq',
] as const
</script>
