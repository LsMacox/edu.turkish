<template>
  <BaseSection id="how-to-choose" bg="gradient">
      <BaseSectionHeader
        :title="t(howToChooseNs('title'))"
        :subtitle="t(howToChooseNs('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <!-- Connection line for desktop -->
      <div class="relative">
        <div
          class="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200"
        />

        <BaseGrid :md="2" :lg="4" gap="lg">
          <div v-for="(tip, index) in tipConfigs" :key="tip.key" class="group relative">
            <!-- Step number badge -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
              <span
                class="toc-badge text-body-sm text-white shadow-card"
                :class="getColorClasses(tip.color).solid"
              >
                {{ index + 1 }}
              </span>
            </div>

            <!-- Card -->
            <BaseCard
              padding="lg"
              shadow="none"
              rounded="2xl"
              bordered
              hover="lift"
              full-height
              class="relative text-center group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-50/50"
            >
              <!-- Mobile step number -->
              <div class="lg:hidden absolute top-4 right-4">
                <span
                  class="w-6 h-6 rounded-badge flex items-center justify-center text-body-sm font-bold text-white"
                  :class="getColorClasses(tip.color).solid"
                >
                  {{ index + 1 }}
                </span>
              </div>

              <!-- Icon with animated ring -->
              <div class="relative mx-auto mb-component-md w-16 h-16">
                <div
                  class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-default"
                  :class="getColorClasses(tip.color).ring"
                />
                <div
                  class="relative icon-container-md transition-default group-hover:scale-110"
                  :class="getColorClasses(tip.color).bg"
                >
                  <Icon
                    :name="tip.icon"
                    class="text-2xl transition-scale group-hover:scale-110"
                    :class="getColorClasses(tip.color).text"
                  />
                </div>
              </div>

              <h3 :class="['text-card-title mb-component-xs', TEXT_HOVER_CLASSES]">
                {{ t(tip.titleKey) }}
              </h3>
              <p class="text-body-sm">
                {{ t(tip.descKey) }}
              </p>
            </BaseCard>
          </div>
        </BaseGrid>
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import type { SemanticColor } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS, TEXT_HOVER_CLASSES } from '~/composables/ui'

const howToChooseNs = namespace('universities.list.how_to_choose')
const tipsNs = namespace('universities.list.how_to_choose.tips')
const { t } = useI18n()

interface Tip {
  key: string
  icon: string
  color: SemanticColor
  titleKey: string
  descKey: string
}

const tipConfigs: Tip[] = [
  { key: 'location', icon: 'mdi:map-marker', color: 'info', titleKey: tipsNs('location.title'), descKey: tipsNs('location.description') },
  { key: 'language', icon: 'mdi:translate', color: 'success', titleKey: tipsNs('language.title'), descKey: tipsNs('language.description') },
  { key: 'dormitory', icon: 'mdi:home', color: 'primary', titleKey: tipsNs('dormitory.title'), descKey: tipsNs('dormitory.description') },
  { key: 'rating', icon: 'mdi:star', color: 'warning', titleKey: tipsNs('rating.title'), descKey: tipsNs('rating.description') },
]

const getColorClasses = (color: SemanticColor) => SEMANTIC_COLOR_TOKENS[color]
</script>
