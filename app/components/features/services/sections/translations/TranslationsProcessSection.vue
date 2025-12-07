<template>
  <section class="py-8 sm:py-12 px-4 sm:px-0">
    <BaseSectionHeader
      :title="title || t('services.common.howItWorks.title')"
      align="center"
      margin-bottom="lg"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
      <ServicesTranslationsStepCard
        v-for="step in stepsWithNumbers"
        :key="step.stepNumber"
        :step="step"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProcessStep } from '~/types/services'

interface Props {
  title?: string
  steps: Omit<ProcessStep, 'stepNumber'>[]
}

const props = defineProps<Props>()
const { t } = useI18n()

// Add step numbers to steps
const stepsWithNumbers = computed(() => {
  return props.steps.map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }))
})
</script>
