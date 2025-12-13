<template>
  <section class="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 rounded-2xl">
    <div class="container">
      <BaseSectionHeader
        :title="title || t(key('services.common.whyChooseUs.title'))"
        align="center"
        margin-bottom="md"
      />

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div
          v-for="(factor, index) in factors"
          :key="index"
          class="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
        >
          <div
            class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
          >
            <Icon :name="factor.icon" class="text-primary text-xl" />
          </div>
          <div>
            <h4 class="text-card-title mb-1">
              {{ factor.title }}
            </h4>
            <p class="text-card-body text-gray-600">
              {{ factor.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
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
