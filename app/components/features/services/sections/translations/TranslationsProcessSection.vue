<template>
  <BaseSection>
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
          class="absolute top-6 left-[10%] right-[10%] h-0.5 bg-surface-elevated"
          aria-hidden="true"
        />
        <div
          v-for="step in stepsWithNumbers"
          :key="step.stepNumber"
          class="flex flex-col items-center text-center flex-1 relative z-10"
        >
          <div
            class="icon-container-sm bg-primary text-white font-bold text-icon mb-component-sm"
          >
            {{ step.stepNumber }}
          </div>
          <h4 class="text-card-title mb-1 px-2">
            {{ step.title }}
          </h4>
          <p class="text-body-sm px-2 max-w-[180px]">
            {{ step.description }}
          </p>
        </div>
      </div>

      <!-- Mobile: compact vertical list -->
      <div class="md:hidden space-component-lg">
        <div
          v-for="step in stepsWithNumbers"
          :key="step.stepNumber"
          class="flex items-start gap-component-lg"
        >
          <div
            class="step-badge bg-primary text-white shrink-0"
          >
            {{ step.stepNumber }}
          </div>
          <div>
            <h4 class="text-card-title mb-1">
              {{ step.title }}
            </h4>
            <p class="text-body-sm">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
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
