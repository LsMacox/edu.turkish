<template>
  <div class="container section-py">
    <!-- Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" />

    <!-- Sub-Services Grid -->
    <div :class="['grid gap-6 mt-12', subServicesCols]">
      <slot name="sub-services" />
    </div>

    <!-- Service Cards Section (for document-translations) -->
    <div v-if="$slots['service-cards']">
      <div class="mt-8">
        <slot name="service-cards" />
      </div>
    </div>

    <!-- Who Is This For Section -->
    <div v-if="$slots['who-is-this-for']" class="mt-16">
      <slot name="who-is-this-for" />
    </div>

    <!-- Course Goal Section -->
    <div v-if="$slots['course-goal']" class="mt-16">
      <slot name="course-goal" />
    </div>

    <!-- Level Progression Section -->
    <div v-if="$slots['level-progression']" class="mt-16">
      <slot name="level-progression" />
    </div>

    <!-- Expected Results Section -->
    <div v-if="$slots['expected-results']" class="mt-16">
      <slot name="expected-results" />
    </div>

    <!-- Timeline Plan Section -->
    <div v-if="$slots['timeline-plan']" class="mt-16">
      <slot name="timeline-plan" />
    </div>

    <!-- Program Content Section -->
    <div v-if="$slots['program-content']" class="mt-16">
      <slot name="program-content" />
    </div>

    <!-- Format & Schedule Section -->
    <div v-if="$slots['format-schedule']" class="mt-16">
      <slot name="format-schedule" />
    </div>

    <!-- Responsibility Matrix Section -->
    <div v-if="$slots['responsibility-matrix']" class="mt-16">
      <slot name="responsibility-matrix" />
    </div>

    <!-- Risk Mitigation Section -->
    <div v-if="$slots['risk-mitigation']" class="mt-16">
      <slot name="risk-mitigation" />
    </div>

    <!-- Student Results Section -->
    <div v-if="$slots['student-results']" class="mt-16">
      <slot name="student-results" />
    </div>

    <!-- Teachers Section -->
    <div v-if="$slots['teachers']" class="mt-16">
      <slot name="teachers" />
    </div>

    <!-- Price Calculator Section -->
    <div v-if="$slots['price-calculator']" class="mt-16">
      <slot name="price-calculator" />
    </div>

    <!-- University Requirements Section -->
    <div v-if="$slots['university-requirements']" class="mt-16">
      <slot name="university-requirements" />
    </div>

    <!-- Sample Documents Section -->
    <div v-if="$slots['sample-documents']" class="mt-16">
      <slot name="sample-documents" />
    </div>

    <!-- How It Works Section -->
    <div v-if="$slots['how-it-works']" class="mt-16">
      <slot name="how-it-works" />
    </div>

    <!-- Why Choose Us Section -->
    <div v-if="$slots['why-choose-us']" class="mt-16">
      <slot name="why-choose-us" />
    </div>

    <!-- FAQ Section -->
    <div v-if="$slots['faq']" class="mt-16">
      <slot name="faq" />
    </div>

    <!-- Trust Indicators -->
    <div v-if="$slots['trust-indicators']" class="mt-12 flex flex-wrap justify-center gap-4">
      <slot name="trust-indicators" />
    </div>

    <!-- Final CTA Section -->
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

const { subServicesCols = 'md:grid-cols-2 lg:grid-cols-3', title, subtitle } = defineProps<Props>()
</script>
