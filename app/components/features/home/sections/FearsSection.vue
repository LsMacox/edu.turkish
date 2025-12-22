<template>
  <BaseSection id="breaking-fears">
      <BaseSectionHeader
        :title="t(fearsNs('title'))"
        :subtitle="t(fearsNs('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <div class="columns-1 md:columns-2 lg:columns-3 gap-component-lg">
        <HomeFearCard
          v-for="fear in fears"
          :key="fear.id"
          :icon="fear.icon"
          :icon-color="fear.iconColor"
          :label="t(fearsNs('fear_label'))"
          :title="t(fearsNs(`fear${fear.id}_title`))"
          :quote="t(fearsNs(`fear${fear.id}_quote`))"
          :answer="t(fearsNs(`fear${fear.id}_answer`))"
          :is-open="openFearIndex === fear.id"
          @toggle="toggleFear(fear.id)"
        />
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'
import { namespace } from '~~/lib/i18n'

interface FearItem {
  id: number
  icon: string
  iconColor: BaseIconBoxProps['color']
}

const fears: FearItem[] = [
  { id: 1, icon: 'mdi:alert-circle', iconColor: 'error' },
  { id: 2, icon: 'mdi:translate', iconColor: 'info' },
  { id: 3, icon: 'mdi:clock-alert', iconColor: 'warning' },
  { id: 4, icon: 'mdi:currency-usd', iconColor: 'secondary' },
  { id: 5, icon: 'mdi:close-circle', iconColor: 'success' },
  { id: 6, icon: 'mdi:home', iconColor: 'warning' },
]

const fearsNs = namespace('home.fears')
const { t } = useI18n()

const openFearIndex = ref<number | null>(null)

const toggleFear = (index: number) => {
  openFearIndex.value = openFearIndex.value === index ? null : index
}
</script>
