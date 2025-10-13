<template>
  <section class="py-12 bg-gray-50 rounded-lg">
    <div class="container">
      <BaseSectionHeader
        :title="title || $t('services.common.whyChooseUs.title')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <TrustFactor v-for="(factor, index) in factors" :key="index" :factor="factor" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TrustFactor } from '~/types/services'

interface Props {
  title?: string
  factors: TrustFactor[]
}

defineProps<Props>()
</script>
