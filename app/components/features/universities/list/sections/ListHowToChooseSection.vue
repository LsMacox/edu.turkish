<template>
  <section id="how-to-choose" class="section-py bg-gradient-to-b from-white to-gray-50">
    <div class="container">
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

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div v-for="(tip, index) in tips" :key="tip.key" class="group relative">
            <!-- Step number badge -->
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10 hidden lg:flex">
              <span
                class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                :class="tip.numberBg"
              >
                {{ index + 1 }}
              </span>
            </div>

            <!-- Card -->
            <div
              class="relative bg-white rounded-2xl border border-gray-100 p-6 text-center h-full transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-200 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-50/50"
            >
              <!-- Mobile step number -->
              <div class="lg:hidden absolute top-4 right-4">
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :class="tip.numberBg"
                >
                  {{ index + 1 }}
                </span>
              </div>

              <!-- Icon with animated ring -->
              <div class="relative mx-auto mb-5 w-16 h-16">
                <div
                  class="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  :class="tip.ringColor"
                />
                <div
                  class="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  :class="tip.bgColor"
                >
                  <Icon
                    :name="tip.icon"
                    class="text-2xl transition-transform duration-300 group-hover:scale-110"
                    :class="tip.iconColor"
                  />
                </div>
              </div>

              <h3
                class="text-lg font-semibold text-secondary mb-3 group-hover:text-primary transition-colors"
              >
                {{ tip.title }}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ tip.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const howToChooseNs = namespace('universities.list.how_to_choose')
const tipsNs = namespace('universities.list.how_to_choose.tips')
const { t } = useI18n()

const tips = computed(() => [
  {
    key: 'location',
    icon: 'mdi:map-marker',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    numberBg: 'bg-blue-500',
    ringColor: 'ring-4 ring-blue-100',
    title: t(tipsNs('location.title')),
    description: t(tipsNs('location.description')),
  },
  {
    key: 'language',
    icon: 'mdi:translate',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    numberBg: 'bg-emerald-500',
    ringColor: 'ring-4 ring-emerald-100',
    title: t(tipsNs('language.title')),
    description: t(tipsNs('language.description')),
  },
  {
    key: 'dormitory',
    icon: 'mdi:home',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    numberBg: 'bg-purple-500',
    ringColor: 'ring-4 ring-purple-100',
    title: t(tipsNs('dormitory.title')),
    description: t(tipsNs('dormitory.description')),
  },
  {
    key: 'rating',
    icon: 'mdi:star',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    numberBg: 'bg-orange-500',
    ringColor: 'ring-4 ring-orange-100',
    title: t(tipsNs('rating.title')),
    description: t(tipsNs('rating.description')),
  },
])
</script>
