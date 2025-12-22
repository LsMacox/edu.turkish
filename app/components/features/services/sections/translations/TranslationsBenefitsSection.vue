<template>
  <BaseSection bg="gray" class="rounded-card">
      <BaseSectionHeader
        :title="title || t(key('services.common.whyChooseUs.title'))"
        align="center"
        margin-bottom="md"
      />

      <BaseGrid :cols="1" :md="3" gap="lg" class="max-w-4xl mx-auto">
        <div
          v-for="(factor, index) in factors"
          :key="index"
          class="flex items-start gap-component-lg sm:flex-col sm:items-center sm:text-center"
        >
          <div
            class="icon-container-sm bg-primary/10 shrink-0"
          >
            <Icon :name="factor.icon" class="text-primary text-icon" />
          </div>
          <div>
            <h4 class="text-card-title mb-1">
              {{ factor.title }}
            </h4>
            <p class="text-body-sm">
              {{ factor.description }}
            </p>
          </div>
        </div>
      </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import type { TrustFactor } from '~/types/features/services'
import { key } from '~~/lib/i18n'

interface Props {
  title?: string
  factors: TrustFactor[]
}

defineProps<Props>()
const { t } = useI18n()
</script>
