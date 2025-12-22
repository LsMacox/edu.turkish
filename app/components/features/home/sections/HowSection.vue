<template>
  <BaseSection id="how-it-works">
    <BaseSectionHeader
      :title="t(howNs('title'))"
      :subtitle="t(howNs('subtitle'))"
      align="center"
      margin-bottom="lg"
    />
    <div class="relative grid md:grid-cols-2 lg:grid-cols-4 gap-component-lg">
      <div class="pointer-events-none absolute top-16 left-0 right-0 hidden lg:block">
        <div class="mx-16 border-t border-dashed border-default" />
      </div>

      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex flex-col items-center text-center space-component-md group"
      >
        <div class="flex flex-col items-center gap-component-sm">
          <BaseStepBadge :step="index + 1" class="hidden md:flex" />
          <BaseIconBox :icon="step.icon" variant="bordered" :color="step.color" size="md" />
        </div>
        <div class="space-component-sm">
          <h3 class="text-card-title">{{ t(howNs(step.titleKey)) }}</h3>
          <p class="text-card-body">{{ t(howNs(step.descKey)) }}</p>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import type { SemanticColor } from '~/types/ui'

interface Step {
  icon: string
  color: SemanticColor
  titleKey: string
  descKey: string
}

const steps: Step[] = [
  { icon: 'mdi:magnify', color: 'info', titleKey: 'step1_title', descKey: 'step1_desc' },
  { icon: 'mdi:pencil', color: 'success', titleKey: 'step2_title', descKey: 'step2_desc' },
  { icon: 'mdi:email', color: 'primary', titleKey: 'step3_title', descKey: 'step3_desc' },
  { icon: 'mdi:airplane', color: 'warning', titleKey: 'step4_title', descKey: 'step4_desc' },
]

const howNs = namespace('home.how')
const { t } = useI18n()
</script>
