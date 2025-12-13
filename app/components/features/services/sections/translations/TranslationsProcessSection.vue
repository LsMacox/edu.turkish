<template>
  <section class="py-8 sm:py-12 px-4 sm:px-0">
    <BaseSectionHeader
      :title="title || t(key('services.common.howItWorks.title'))"
      align="center"
      margin-bottom="md"
    />

    <div class="max-w-5xl mx-auto">
      <!-- Desktop: horizontal timeline -->
      <div class="hidden md:flex items-start justify-between relative">
        <!-- Connecting line -->
        <div
          class="absolute top-6 left-[10%] right-[10%] h-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div
          v-for="step in stepsWithNumbers"
          :key="step.stepNumber"
          class="flex flex-col items-center text-center flex-1 relative z-10"
        >
          <div
            class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base mb-3"
          >
            {{ step.stepNumber }}
          </div>
          <h4 class="text-card-title mb-1 px-2">
            {{ step.title }}
          </h4>
          <p class="text-card-body text-gray-600 px-2 max-w-[180px]">
            {{ step.description }}
          </p>
        </div>
      </div>

      <!-- Mobile: compact vertical list -->
      <div class="md:hidden space-y-5">
        <div
          v-for="step in stepsWithNumbers"
          :key="step.stepNumber"
          class="flex items-start gap-4"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0"
          >
            {{ step.stepNumber }}
          </div>
          <div>
            <h4 class="text-card-title mb-1">
              {{ step.title }}
            </h4>
            <p class="text-card-body text-gray-600">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProcessStep } from '~/types/features/services'
import { key } from '~~/lib/i18n'

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
