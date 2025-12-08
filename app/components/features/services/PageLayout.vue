<template>
  <div class="container pt-6 md:pt-8 pb-8 md:pb-10">
    <!-- Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" />

    <!-- Sub-Services Grid -->
    <div v-if="$slots['sub-services']" :class="['grid gap-6 mt-12', subServicesCols]">
      <slot name="sub-services" />
    </div>

    <!-- Service Cards -->
    <div v-if="$slots['service-cards']" class="mt-8">
      <slot name="service-cards" />
    </div>

    <!-- All content sections with consistent spacing -->
    <template v-for="name in sectionSlots" :key="name">
      <div v-if="$slots[name]" class="mt-16">
        <slot :name="name" />
      </div>
    </template>

    <!-- Final CTA -->
    <div v-if="$slots['final-cta']" class="mt-16">
      <slot name="final-cta" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  subServicesCols?: string
}

withDefaults(defineProps<Props>(), {
  subServicesCols: 'md:grid-cols-2 lg:grid-cols-3',
})

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
