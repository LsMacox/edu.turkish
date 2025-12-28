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
          :title="t(FEAR_TITLE_KEYS[fear.id])"
          :quote="t(FEAR_QUOTE_KEYS[fear.id])"
          :answer="t(FEAR_ANSWER_KEYS[fear.id])"
          :is-open="openFearIndex === fear.id"
          @toggle="toggleFear(fear.id)"
        />
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import type { BaseIconBoxProps } from '~/types/ui'
import { namespace } from '~~/lib/i18n'

type FearId = 1 | 2 | 3 | 4 | 5 | 6

interface FearItem {
  id: FearId
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

const FEAR_TITLE_KEYS: Record<FearId, ReturnType<typeof fearsNs>> = {
  1: fearsNs('fear1_title'),
  2: fearsNs('fear2_title'),
  3: fearsNs('fear3_title'),
  4: fearsNs('fear4_title'),
  5: fearsNs('fear5_title'),
  6: fearsNs('fear6_title'),
}

const FEAR_QUOTE_KEYS: Record<FearId, ReturnType<typeof fearsNs>> = {
  1: fearsNs('fear1_quote'),
  2: fearsNs('fear2_quote'),
  3: fearsNs('fear3_quote'),
  4: fearsNs('fear4_quote'),
  5: fearsNs('fear5_quote'),
  6: fearsNs('fear6_quote'),
}

const FEAR_ANSWER_KEYS: Record<FearId, ReturnType<typeof fearsNs>> = {
  1: fearsNs('fear1_answer'),
  2: fearsNs('fear2_answer'),
  3: fearsNs('fear3_answer'),
  4: fearsNs('fear4_answer'),
  5: fearsNs('fear5_answer'),
  6: fearsNs('fear6_answer'),
}

const openFearIndex = ref<number | null>(null)

const toggleFear = (index: number) => {
  openFearIndex.value = openFearIndex.value === index ? null : index
}
</script>
